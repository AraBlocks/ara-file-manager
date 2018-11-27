'use strict'

const debug = require('debug')('acm:kernel:lib:actions:araContractsManager')
const { abi: AFSAbi } = require('ara-contracts/build/contracts/AFS.json')
const { abi: tokenAbi } = require('ara-contracts/build/contracts/AraToken.json')
const araFilesystem = require('ara-filesystem')
const k = require('../../../lib/constants/stateManagement')
const { ARA_TOKEN_ADDRESS } = require('ara-contracts/constants')
const araContracts = require('ara-contracts')
const windowManager = require('electron-window-manager')
const store = windowManager.sharedData.fetch('store')
const { web3 } = require('ara-context')()
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
	try {
		const result = await araFilesystem.getPrice({ did })
		return result
	} catch (err) {
		debug('Error getting price: %o', err)
	}
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
	try {
		const balanceInWei = await web3.eth.getBalance(account)
		const balance = web3.utils.fromWei(balanceInWei, 'ether')
		debug('Ether balance is %s', balance)
		return balance
	} catch (err) {
		debug('Error getting eth balance: %o', err)
		return 0
	}
}

async function purchaseItem(opts) {
	const {
		budget,
		contentDID: contentDid,
		userDID: requesterDid,
		password
	} = opts
	debug('Purchasing item: %s', contentDid)
	try {
		const { jobId } = await araContracts.purchase(
			{
				budget,
				contentDid,
				password,
				requesterDid,
			}
		)
		debug('Purchase Completed')
		return jobId
	} catch (err) {
		debug('Error purchasing item: %o', err)
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
	const updatedEarnings = items.map(async (item) => {
		const earnings = await getEarnings(item)

		return { ...item, earnings }
	})

	return Promise.all(updatedEarnings)
}

async function getAFSContract(contentDID) {
	if (!araContracts.registry.proxyExists(contentDID)) { return false }
	const proxyAddress = await araContracts.registry.getProxyAddress(contentDID)
	return await contractUtil.get(AFSAbi, proxyAddress)
}

async function getAllocatedRewards(item, userDID, password) {
	return {
		...item,
		allocatedRewards: Number(await araContracts.rewards.getRewardsBalance({
			farmerDid: userDID,
			contentDid: 'did:ara:' + item.did,
			password
		}))
	}
}

async function getEarnings({ did }) {
	let earnings = 0
	const { contract, ctx } = await getAFSContract(did)

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
	let totalRewards = 0
	const { contract, ctx } = await getAFSContract(item.did)
	try {
		if (contract) {
			const opts = { fromBlock: 0, toBlock: 'latest' }
			totalRewards = (await contract.getPastEvents('Redeemed', opts))
				.reduce((sum, { returnValues }) =>
					returnValues._sender === userEthAddress
						? sum += Number(araContracts.token.constrainTokenValue(returnValues._amount))
						: sum
					, 0)
		}
	} catch (err) {
		debug('Error getting rewards for %s : %o', item.did, err)
	}

	ctx.close()
	return { ...item, earnings: item.earnings += totalRewards }
}

async function subscribePublished({ did }) {
	let subscription
	const { contract, ctx } = await getAFSContract(did)
	if (contract) {
		try {
			subscription = contract.events.Purchased()
				.on('data', async ({ returnValues }) => {
					const did = returnValues._did.slice(-64)
					const earning = await getAFSPrice({ did })
					windowManager.internalEmitter.emit(k.UPDATE_EARNING, { did, earning })
				})
				.on('error', debug)
		} catch (err) {
			debug('Error: %o', err)
		}
	}

	ctx.close()
	return subscription
}

async function sendAra({
	amount,
	completeHandler,
	errorHandler,
	walletAddress,
}) {
	try {
		await araContracts.token.transfer({
			did: store.account.userAid,
			password: store.account.password,
			val: amount,
			to: walletAddress
		})
		completeHandler(amount)
	} catch (err) {
		debug('Error sending ara: %o', err)
		errorHandler()
	}
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

	ctx.close()
	return rewardsSubscription
}

async function subscribeTransfer(userAddress) {
	const { contract, ctx } = await contractUtil.get(tokenAbi, ARA_TOKEN_ADDRESS)

	let transferSubscription
	try {
		transferSubscription = contract.events.Transfer({ filter: { to: userAddress } })
			.on('data', async () => {
				const newBalance = await getAraBalance(store.account.userAid)
				windowManager.internalEmitter.emit(k.UPDATE_BALANCE, { araBalance: newBalance })
			})
			.on('error', debug)
	} catch (err) {
		debug('Error %o', err)
	}

	return transferSubscription
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
	sendAra,
	subscribePublished,
	subscribeRewardsAllocated,
	subscribeTransfer
}