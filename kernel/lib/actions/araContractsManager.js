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
const { web3: { account: araAccount } } = require('ara-util')

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
	if (!araContracts.registry.proxyExists(contentDID)) return false
	const proxyAddress = await araContracts.registry.getProxyAddress(contentDID)
	return new web3.eth.Contract(AFSAbi, proxyAddress)
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
	const opts = { fromBlock: 0, toBlock: 'latest' }
	try {
		const AFSContract = await getAFSContract(did)
		if (!AFSContract) return 0
		const earnings = (await AFSContract.getPastEvents('Purchased', opts))
			.reduce((sum, { returnValues }) => sum + Number(araContracts.token.constrainTokenValue(returnValues._price)), 0)

		return earnings
	} catch (err) {
		debug('Error getting earnings for %s : %o', did, err)
		return 0
	}
}

async function getRewards(item, userEthAddress) {
	const opts = { fromBlock: 0, toBlock: 'latest' }
	try {
		const AFSContract = await getAFSContract(item.did)
		if (!AFSContract) return 0

		const totalRewards = (await AFSContract.getPastEvents('Redeemed', opts))
			.reduce((sum, { returnValues }) =>
				returnValues._sender === userEthAddress
					? sum += Number(araContracts.token.constrainTokenValue(returnValues._amount))
					: sum
				, 0)

		return { ...item, earnings: item.earnings += totalRewards }
	} catch (err) {
		debug('Error getting rewards for %s : %o', item.did, err)
	}
}

async function subscribePublished({ did }) {
	try {
		const AFSContract = await getAFSContract(did)
		if (!AFSContract) throw 'Not a valid proxy'

		const subscription = AFSContract.events.Purchased()
			.on('data', async ({ returnValues }) => {
				const did = returnValues._did.slice(-64)
				const earning = await getAFSPrice({ did })
				windowManager.internalEmitter.emit(k.UPDATE_EARNING, { did, earning })
			})
			.on('error', debug)

		return subscription
	} catch (err) {
		debug('Error: %o', err)
	}
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
	try {
		const AFSContract = await getAFSContract(contentDID)
		const rewardsSubscription = AFSContract.events.RewardsAllocated({ filter: { _farmer: userDID } })
			.on('data', async ({ returnValues }) => {
				if (returnValues._farmer !== ethereumAddress) { return }

				const rewardsBalance = await rewards.getRewardsBalance({ contentDid: contentDID, farmerDid: userDID })
				windowManager.internalEmitter.emit(k.REWARDS_ALLOCATED, { did: contentDID, rewardsBalance })
			})
			.on('error', debug)

		return rewardsSubscription
	} catch (err) {
		debug('Error subscribing to rewards: %o', err)
	}
}

function subscribeTransfer(userAddress) {
	try {
		const tokenContract = new web3.eth.Contract(tokenAbi, ARA_TOKEN_ADDRESS)
		const transferSubscription = tokenContract.events.Transfer({ filter: { to: userAddress } })
			.on('data', async () => {
				const newBalance = await getAraBalance(store.account.userAid)
				windowManager.internalEmitter.emit(k.UPDATE_BALANCE, { araBalance: newBalance })
			})
			.on('error', debug)

		return transferSubscription
	} catch (err) {
		debug('Error %o', err)
	}
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