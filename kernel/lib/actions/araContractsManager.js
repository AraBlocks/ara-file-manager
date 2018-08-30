'use strict'

const debug = require('debug')('acm:kernel:lib:actions:araContractsManager')
const {
  web3: {
    account,
  }
} = require('ara-util')
const Web3 = require('web3')
const PROVIDER = 'ws://127.0.0.1:8546'

async function getAccountAddress(owner, password) {
	try {
		debug('Getting Account Address ')
		const acct = await account.load({ did: owner, password })
		return acct.address
	} catch(e) {
		debug(e)
	}
}

async function getUserBalance(account) {
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