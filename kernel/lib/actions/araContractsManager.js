'use strict'

const debug = require('debug')('acm:kernel:lib:actions:araContractsManager')

const { abi: AFSAbi } = require('ara-contracts/build/contracts/AFS.json')
const {
	library,
	purchase,
	registry,
	token
} = require('ara-contracts')
const fs = require('fs')
const path = require('path')
const userHome = require('user-home')
const windowManager = require('electron-window-manager')
const store = windowManager.sharedData.fetch('store')
const { web3 } = require('ara-context')()
const { web3: { account: araAccount } } = require('ara-util')

async function getAccountAddress(owner, password) {
	try {
		debug('Getting account address', owner, password)
		const acct = await araAccount.load({ did: owner, password })
		debug('Account address is ', acct.address)
		return acct.address
	} catch (e) {
		debug('Error getting account Address: %o', e)
	}
}

async function getAraBalance(address) {
	debug('Getting account balance')
	try {
		const balance = await token.balanceOf(address)
		debug('Balance is %s ARA', balance)
		return balance
	} catch (err) {
		debug('Error getting ara balance: %o', err)
	}
}

async function purchaseItem(contentDid) {
	debug('Purchasing item: %s', contentDid)
	const {
		account: {
			userAid,
			password
		}
	} = store
	try {
		await purchase(
			{
				requesterDid: userAid,
				contentDid,
				password,
			}
		)
		debug('Purchase Completed')
	} catch (err) {
		debug('Error purchasing item: %o', e)
	}
}

async function getLibraryItems(userAid) {
	try {
		const lib = await library.getLibrary(userAid)
		debug('Got %s lib items', lib.length)
		return lib
	} catch (err) {
		debug('Error getting lib items: %o', err)
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

function getAcmFilePath() {
	const { account: { userAid } } = store
	if (userAid == null) {
		debug('User has not logged in')
		return null
	}
	const acmDirectory = path.resolve(userHome, '.acm')
	fs.existsSync(acmDirectory) || fs.mkdirSync(acmDirectory)
	const fileDirectory = path.resolve(userHome, '.acm', userAid.slice(8))
	return fileDirectory
}

async function getPublishedItems() {
	return new Promise((resolve, reject) => {
		const fileDirectory = getAcmFilePath()
		if (fileDirectory == null) return
		fs.readFile(fileDirectory, function (err, data) {
			if (err) return resolve([])
			const itemList = data.toString('utf8').slice(0, -1).split('\n')
			debug(`Retrieved %s published items`, itemList.length)
			return resolve(itemList)
		})
	})
}

function savePublishedItem(contentDid) {
	try {
		debug(`Saving published item ${contentDid}`)
		const fileDirectory = getAcmFilePath()
		if (fileDirectory == null) return
		fs.appendFileSync(fileDirectory, `${contentDid}\n`)
	} catch (err) {
		debug(err)
	}
}

async function getPublishedEarnings(items) {
	debug('Getting earnings for published items')
	const updatedEarnings = items.map(async (item) => {
		const earnings = await getEarnings(item)
		return {
			...item,
			meta: { ...item.meta, earnings }
		}
	})

	return Promise.all(updatedEarnings)
}

async function getEarnings(item) {
	const opts = { fromBlock: 0, toBlock: 'latest' }
	try {
		const proxyAddress = await registry.getProxyAddress(item.meta.aid)
		const AFSContract = new web3.eth.Contract(AFSAbi, proxyAddress)

		const priceSets = (await AFSContract.getPastEvents('PriceSet', opts))
			.map(event => ({
				blockNumber: event.blockNumber,
				price: Number(token.constrainTokenValue(event.returnValues[1]))
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
		debug('Error getting earnings for %s : %o', item.meta.aid, err)
	}
}

module.exports = {
	getAccountAddress,
	getAraBalance,
	getEarnings,
	getEtherBalance,
	getLibraryItems,
	getPublishedEarnings,
	getPublishedItems,
	purchaseItem,
	savePublishedItem
}