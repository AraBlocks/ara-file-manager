'use strict'

const { abi } = require('ara-contracts/build/contracts/ARAToken.json')
const { kARATokenAddress } = require('ara-contracts/constants')
const { purchase, library } = require('ara-contracts')
const debug = require('debug')('acm:kernel:lib:actions:araContractsManager')
const Web3 = require('web3')
const PROVIDER = 'ws://127.0.0.1:8546'

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

async function getUserBalance(account) {
	debug('Getting account balance')
	try {
		const balance = await call({
			abi,
			address: '0xd7ba1cafae3349df74a245a15d2a39efeaa25eda', // Remember to change this!!!
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

async function purchaseItem(userAid, password, contentDid) {
	try {
		let result = await purchase(
			{
				requesterDid: 'ab10d1792f80143bb466597bafe5c71119845f88ee3d27f89944c1969579452d',
				contentDid: '56378067e164a53a6650f5f767d307748f831fcbd3ce3dadb3f457bccb2663ac',
				password: 'abc',
				job: {
					jobId: '0x0000000000000000000000000000000000000000000000000000000000000000',
					budget: 100000
				}
			}
		)
		console.log(result)
	} catch(e) {
		console.log(e)
	}
}

async function getLibraryItems(userAid) {
	try {
		const lib = await library.getLibrary(userAid)
		return lib
	} catch(e) {
		debug(e)
	}
}

async function getEtherBalance(account) {
	try {
		const web3 = new Web3(new Web3.providers.WebsocketProvider(PROVIDER))
		const balanceInWei = await web3.eth.getBalance(account)
		const balance = web3.utils.fromWei(balanceInWei, 'ether')
		return balance
	} catch(e) {
		debug(e)
	}
}

module.exports = {
	getAccountAddress,
	getUserBalance
}