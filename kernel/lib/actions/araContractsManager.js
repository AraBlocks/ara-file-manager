'use strict'

const debug = require('debug')('acm:kernel:lib:actions:araContractsManager')
const { abi } = require('ara-contracts/build/contracts/ARAToken.json')
const { kAraTokenAddress } = require('ara-contracts/constants')
const { purchase, library } = require('ara-contracts')
const fs = require('fs')
const path = require('path')
const userHome = require('user-home')
const windowManager = require('electron-window-manager')
const { web3 } = require('ara-context')()
const {
	web3: {
		account,
		call,
  }
} = require('ara-util')

async function getAccountAddress(owner, password) {
	try {
		debug('Getting account address')
		const acct = await account.load({ did: owner, password })
		debug(`Account address is ${acct.address}`)
		return acct.address
	} catch(e) {
		debug(e)
	}
}

async function getAraBalance(account) {
	debug('Getting account balance')
	try {
		const balance = await call({
			abi,
			address: kAraTokenAddress,
			functionName: 'balanceOf',
			arguments: [
				account
			]
		})
		debug(`Balance is ${balance} ARA`)
		return balance
	} catch(e) {
		debug(e)
	}
}

async function purchaseItem(contentDid) {
	debug(`Purchasing item ${contentDid}`)
	const { account: { aid }} = windowManager.sharedData.fetch('store')
	const { password } = aid
	try {
		await purchase(
			{
				requesterDid: aid.ddo.id,
				contentDid,
				password,
			}
		)
		debug('Purchase Completed')
	} catch(e) {
		debug(e)
	}
}

async function getLibraryItems(userAid) {
	try {
		const lib = await library.getLibrary(userAid)
		debug('Got %s lib items', lib.length)
		return lib
	} catch(e) {
		debug(e)
	}
}

async function getEtherBalance(account) {
	try {
		const balanceInWei = await web3.eth.getBalance(account)
		const balance = web3.utils.fromWei(balanceInWei, 'ether')
		debug(`Ether balance is ${balance}`)
		return balance
	} catch(e) {
		debug(e)
	}
}

function getAcmFilePath() {
	const { account: { aid }} = windowManager.sharedData.fetch('store')
	if(aid.ddo == null) {
		debug('User has not logged in')
		return null
	}
	const acmDirectory = path.resolve(userHome, '.acm')
	console.log(fs.existsSync(acmDirectory))
	fs.existsSync(acmDirectory) || fs.mkdirSync(acmDirectory)
	const fileDirectory = path.resolve(userHome, '.acm', aid.ddo.id.slice(8))
	return fileDirectory
}

async function getPublishedItems() {
	return new Promise((resolve, reject) => {
		const fileDirectory = getAcmFilePath()
		if (fileDirectory == null) return
		fs.readFile(fileDirectory, function (err, data) {
			if (err) return resolve([])
			const itemList = data.toString('utf8').slice(0,-1).split('\n')
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
	} catch(err) {
		debug(err)
	}
}

module.exports = {
	getAccountAddress,
	getAraBalance,
	getEtherBalance,
	getLibraryItems,
	getPublishedItems,
	purchaseItem,
	savePublishedItem
}