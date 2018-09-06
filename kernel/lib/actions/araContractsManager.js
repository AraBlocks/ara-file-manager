'use strict'

const debug = require('debug')('acm:kernel:lib:actions:araContractsManager')
const { abi } = require('ara-contracts/build/contracts/ARAToken.json')
const { kARATokenAddress } = require('ara-contracts/constants')
const { purchase, library } = require('ara-contracts')
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
			address: kARATokenAddress,
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

module.exports = {
	getAccountAddress,
	getAraBalance,
	getEtherBalance,
	getLibraryItems,
	purchaseItem
}