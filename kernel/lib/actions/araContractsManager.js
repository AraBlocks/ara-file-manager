'use strict'

const debug = require('debug')('acm:kernel:lib:actions:araContractsManager')
const { abi: AFSAbi } = require('ara-contracts/build/contracts/AFS.json')
const { abi: tokenAbi } = require('ara-contracts/build/contracts/AraToken.json')
const araFilesystem = require('ara-filesystem')
const { UPDATE_EARNING, UPDATE_BALANCE } = require('../../../lib/constants/stateManagement')
const { ARA_TOKEN_ADDRESS } = require('ara-contracts/constants')
const araContracts = require('ara-contracts')
const windowManager = require('electron-window-manager')
const store = windowManager.sharedData.fetch('store')
const { web3 } = require('ara-context')()
const { web3: { account: araAccount } } = require('ara-util')

async function getAccountAddress(owner, password) {
	try {
		debug('Getting account address', owner, password)
		owner = owner.includes('did') ? owner : 'did:ara:' + owner
		const acct = await araAccount.load({ did: owner, password })
		debug('Account address is ', acct.address)
		return acct.address
	} catch (e) {
		debug('Error getting account Address: %o', e)
	}
}

async function getAFSPrice({ did }) {
	const result = await araFilesystem.getPrice({ did })
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

async function purchaseItem(contentDid) {
	debug('Purchasing item: %s', contentDid)
	const { account } = store
	try {
		await araContracts.purchase(
			{
				requesterDid: account.userAid,
				contentDid,
				password: account.password,
				budget: 0
			}
		)
		debug('Purchase Completed')
		return
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

async function getEarnings({ did }) {
	const opts = { fromBlock: 0, toBlock: 'latest' }
	try {
		const AFSContract = await getAFSContract(did)
		if (!AFSContract) return 0

		const priceSets = (await AFSContract.getPastEvents('PriceSet', opts))
			.map(event => ({
				blockNumber: event.blockNumber,
				price: Number(araContracts.token.constrainTokenValue(event.returnValues._price))
			}))

		const purchases = (await AFSContract.getPastEvents('Purchased', opts))
			.map(({ blockNumber }) => blockNumber)

		const itemEarnings = purchases.reduce((totalEarnings, current) => {
			let earning
			if (priceSets.length > 1) {
				if (current.block < priceSets[1].blockNumber) {
					earning = priceSets[0].price
				} else {
					priceSets.shift()
					earning = priceSets[0].price
				}
			} else {
				earning = priceSets[0].price
			}
			return totalEarnings += earning
		}, 0)

		return itemEarnings
	} catch (err) {
		debug('Error getting earnings for %s : %o', did, err)
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
				windowManager.internalEmitter.emit(UPDATE_EARNING, { did, earning })
			})
			.on('error', debug)

		return subscription
	} catch (err) {
		debug('Error: %o', err)
	}
}

async function getAFSContract(contentDID) {
	if (!araContracts.registry.proxyExists(contentDID)) return false
	const proxyAddress = await araContracts.registry.getProxyAddress(contentDID)
	return new web3.eth.Contract(AFSAbi, proxyAddress)
}

function subscribeTransfer(userAddress) {
	try {
		const tokenContract = new web3.eth.Contract(tokenAbi, ARA_TOKEN_ADDRESS)
		const transferSubscription = tokenContract.events.Transfer({ filter: { to: userAddress } })
		.on('data', async () => {
			const newBalance = await getAraBalance(store.account.userAid)
			windowManager.internalEmitter.emit(UPDATE_BALANCE, newBalance)
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
	getAraBalance,
	getEarnings,
	getEtherBalance,
	getLibraryItems,
	getPublishedEarnings,
	purchaseItem,
	subscribePublished,
	subscribeTransfer
}