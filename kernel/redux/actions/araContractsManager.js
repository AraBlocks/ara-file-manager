'use strict'

const debug = require('debug')('acm:kernel:lib:actions:araContractsManager')
const { abi: AFSAbi } = require('ara-contracts/build/contracts/AFS.json')
const { abi: tokenAbi } = require('ara-contracts/build/contracts/AraToken.json')
const araFilesystem = require('ara-filesystem')
const k = require('../../../lib/constants/stateManagement')
const { FAUCET_OWNER } = require('../../../lib/constants/networkKeys')
const { ARA_TOKEN_ADDRESS } = require('ara-contracts/constants')
const araContracts = require('ara-contracts')
const windowManager = require('electron-window-manager')
const createContext = require('ara-context')
const {
	web3: {
		account: araAccount,
		contract: contractUtil
	}
} = require('ara-util')

async function getAccountAddress(owner, password) {
	try {
		debug('Getting account address')
		owner = owner.includes('did') ? owner : 'did:ara:' + owner
		const acct = await araAccount.load({ did: owner, password })
		return acct.address
	} catch (e) {
		debug('Error getting account Address: %o', e)
	}
}

async function getAFSPrice({ did }) {
	let result = 0
	try {
		result = await araFilesystem.getPrice({ did })
	} catch (err) {
		debug('Error getting price: %o', err)
	}
	return result
}

async function getAraBalance(userDID) {
	debug('Getting account balance')
	try {
		const balance = await araContracts.token.balanceOf(userDID)
		debug('Balance is %s ARA', balance)
		return balance
	} catch (err) {
		debug('Error getting ara balance: %o', err)
		return 0
	}
}

async function getEtherBalance(account) {
	const ctx = createContext()
	await ctx.ready()
	const { web3 } = ctx

	let balance = 0
	try {
		const balanceInWei = await web3.eth.getBalance(account)
		balance = web3.utils.fromWei(balanceInWei, 'ether')
	} catch (err) {
		debug('Error getting eth balance: %o', err)
	}

	ctx.close()
	return balance
}

async function purchaseItem(opts) {
	const {
		contentDID: contentDid,
		userDID: requesterDid,
		password,
	} = opts
	debug('Purchasing item: %s', contentDid)
	try {
		const { jobId } = await araContracts.purchase({
			budget: await _calculateBudget(contentDid),
			contentDid,
			password,
			requesterDid,
			estimate: false
		})

		return jobId
	} catch (err) {
		throw new Error('Error purchasing item: %o', err)
	}
}

async function purchaseEstimate(opts) {
	const {
		contentDID: contentDid,
		userDID: requesterDid,
		password,
	} = opts
	try {
		const gasEstimate = await araContracts.purchase({
			budget: await _calculateBudget(contentDid),
			contentDid,
			password,
			requesterDid,
			estimate: true
		})

		return gasEstimate
	} catch (err) {
		throw new Error('Error getting purchase estimate: %o', err)
	}
}

async function getLibraryItems(userDID) {
	try {
		const lib = await araContracts.library.getLibrary(userDID)
		debug('Got %s lib items', lib.length)
		return lib
	} catch (err) {
		debug('Error getting lib items: %o', err)
	}
}

async function getPublishedEarnings(items) {
	debug('Getting earnings for published items')
	const updatedEarnings = items.map(async (item) => ({ ...item, earnings: await getEarnings(item) }))

	return Promise.all(updatedEarnings)
}

async function getAFSContract(contentDID) {
	if (!araContracts.registry.proxyExists(contentDID)) { return {} }
	const proxyAddress = await araContracts.registry.getProxyAddress(contentDID)
	return await contractUtil.get(AFSAbi, proxyAddress)
}

async function getAllocatedRewards(item, userDID, password) {
	const allocatedRewards = Number(await araContracts.rewards.getRewardsBalance({
		farmerDid: userDID,
		contentDid: 'did:ara:' + item.did,
		password
	}))

	return { ...item, allocatedRewards }
}

async function getEarnings({ did }) {
	const { contract, ctx } = await getAFSContract(did)

	let earnings = 0
	if (contract) {
		try {
			const opts = { fromBlock: 0, toBlock: 'latest' }
			earnings = (await contract.getPastEvents('Purchased', opts))
				.reduce((sum, { returnValues }) => sum + Number(araContracts.token.constrainTokenValue(returnValues._price)), 0)
		} catch (err) {
			debug('Error getting earnings for %s : %o', did, err)
		}
	}

	ctx.close()
	return earnings
}

async function getRewards(item, userEthAddress) {
	const { contract, ctx } = await getAFSContract(item.did)

	let totalRewards = 0
	if (contract) {
		try {
			const opts = { fromBlock: 0, toBlock: 'latest' }
			totalRewards = (await contract.getPastEvents('Redeemed', opts))
				.reduce((sum, { returnValues }) =>
					returnValues._sender === userEthAddress
						? sum += Number(araContracts.token.constrainTokenValue(returnValues._amount))
						: sum
					, 0)
		} catch (err) {
			debug('Error getting rewards for %s : %o', item.did, err)
		}
	}

	ctx.close()
	return { ...item, earnings: item.earnings += totalRewards }
}

async function subscribeEthBalance(userAddress) {
	let subscription
	const ctx = createContext()
	await ctx.ready()
	const { web3 } = ctx
	try {
		subscription = web3.eth.subscribe('newBlockHeaders', async (err, ret) => {
			if (err) {
				debug("Error: %o", err)
			} else {
				const ethBalance = await getEtherBalance(userAddress)
				windowManager.internalEmitter.emit(k.UPDATE_ETH_BALANCE, { ethBalance })
			}
		})
	} catch (err) {
		debug('Error getting Eth balance %o', err)
	}
	return { ctx, subscription }
}

async function subscribePublished({ did }) {
	const { contract, ctx } = await getAFSContract(did)

	let subscription
	if (contract) {
		try {
			subscription = contract.events.Purchased()
				.on('data', async ({ returnValues }) => {
					const earning = Number(araContracts.token.constrainTokenValue(returnValues._price))
					windowManager.internalEmitter.emit(k.UPDATE_EARNING, { did, earning })
				})
				.on('error', debug)
		} catch (err) {
			debug('Error: %o', err)
		}
	}

	return { ctx, subscription }
}

async function sendAra(opts) {
	await araContracts.token.transfer(opts)
}

async function subscribeFaucet(userAddress) {
	const { contract, ctx } = await contractUtil.get(tokenAbi, ARA_TOKEN_ADDRESS)

	let subscription
	try {
		subscription = contract.events.Transfer({ filter: { to: userAddress, from: FAUCET_OWNER } })
			.on('data', () => windowManager.internalEmitter.emit(k.FAUCET_ARA_RECEIVED))
			.on('error', debug)
	} catch (err) {
		debug('Error %o', err)
	}

	return { ctx, subscription }
}

async function subscribeRewardsAllocated(contentDID, ethereumAddress, userDID) {
	const { rewards } = araContracts
	const { contract, ctx } = await getAFSContract(contentDID)

	let rewardsSubscription
	if (contract) {
		try {
			rewardsSubscription = contract.events.RewardsAllocated()
				.on('data', async ({ returnValues }) => {
					if (returnValues._farmer !== ethereumAddress) { return }
					const rewardsBalance = await rewards.getRewardsBalance({ contentDid: contentDID, farmerDid: userDID })
					windowManager.internalEmitter.emit(k.REWARDS_ALLOCATED, { did: contentDID, rewardsBalance })
				})
				.on('error', debug)
		} catch (err) {
			debug('Error subscribing to rewards: %o', err)
		}
	}

	return { ctx, rewardsSubscription }
}

async function subscribeTransfer(userAddress, userDID) {
	const { contract, ctx } = await contractUtil.get(tokenAbi, ARA_TOKEN_ADDRESS)

	let xferReceiveSubscription
	let xferSendSubscription
	try {
		xferReceiveSubscription = contract.events.Transfer({ filter: { to: userAddress } })
			.on('data', updateBalance)
			.on('error', debug)

		xferSendSubscription = contract.events.Transfer({ filter: { from: userAddress } })
			.on('data', updateBalance)
			.on('error', debug)

	} catch (err) {
		debug('Error %o', err)
	}

	return { ctx, xferReceiveSubscription, xferSendSubscription }

	async function updateBalance() {
		const newBalance = await getAraBalance(userDID)
		windowManager.internalEmitter.emit(k.UPDATE_ARA_BALANCE, { araBalance: newBalance })
	}
}

async function subscribeAFSUpdates(contentDID) {
	const { contract, ctx } = await getAFSContract(contentDID)

	let subscription
	if (contract) {
		try {
			subscription = contract.events.Commit()
				.on('data', async () => {
					const updateAvailable = await araFilesystem.isUpdateAvailable({ did: contentDID })
					updateAvailable && windowManager.internalEmitter.emit(k.UPDATE_AVAILABLE, { did: contentDID })
				})
				.on('error', debug)
		} catch (err) {
			debug('Error subscribing to rewards: %o', err)
		}
	}

	return { ctx, subscription }
}

//budget is fixed to 10% of price for now
async function _calculateBudget(did) {
	let budget
	try {
		budget = (await getAFSPrice({ did })) / 10
	} catch (err) {
		debug('Err getting AFS price: %o', err)
		budget = 0
	}

	return budget
}

module.exports = {
	getAccountAddress,
	getAFSPrice,
	getAllocatedRewards,
	getAraBalance,
	getEarnings,
	getEtherBalance,
	getLibraryItems,
	getPublishedEarnings,
	getRewards,
	purchaseItem,
	purchaseEstimate,
	sendAra,
	subscribeEthBalance,
	subscribeAFSUpdates,
	subscribeFaucet,
	subscribePublished,
	subscribeRewardsAllocated,
	subscribeTransfer
}