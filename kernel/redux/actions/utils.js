'use strict'

const debug = require('debug')('afm:kernel:lib:actions:util')
const { stateManagement: k, networkKeys } = require('k')
const afs = require('ara-filesystem')
const acmManager = require('./acmManager')
const araUtil = require('ara-util')
const { createAFSKeyPath } = require('ara-filesystem/key-path')
const path = require('path')
const fs = require('fs')
const createContext = require('ara-context')
const request = require('request-promise')

async function getNetwork() {
	const ctx = createContext()
	await ctx.ready()
	const { web3 } = ctx

	const networkType = await web3.eth.net.getNetworkType()

	ctx.close()
	return networkType
}

function makeAfsPath(did) {
	return path.join(createAFSKeyPath(did), 'home', 'content')
}

async function readFileMetadata(did) {
	let fileInfo = {}
	try {
		const data = await afs.metadata.readFile({ did })
		fileInfo = JSON.parse(data.fileInfo)
	} catch (err) {
		debug('No metadata for %s', did)
	}
	return fileInfo
}

async function requestAraFaucet(userDID) {
	return await request.post({
		method: 'POST',
		uri: networkKeys.FAUCET_URI,
		body: { to: userDID },
		json: true
	})
}

async function requestEthFaucet(ethAddress) {
	return await request(`https://faucet.ropsten.be/donate/${ethAddress}`)
}

async function writeFileMetaData({
	did,
	size = 0,
	title = '',
	userDID = '',
	password
}) {
	try {
		const fileData = {
			author: userDID,
			size,
			title,
			timestamp: new Date
		}
		const fileDataString = JSON.stringify(fileData)
		debug('Adding file metadata for %s', did)
		await afs.metadata.writeKey({ did, key: 'fileInfo', value: fileDataString, password })
	} catch (e) {
		debug(e)
	}
}

module.exports = {
	getNetwork,
	makeAfsPath,
	readFileMetadata,
	requestAraFaucet,
	requestEthFaucet,
	writeFileMetaData
}