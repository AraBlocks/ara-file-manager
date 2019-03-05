const debug = require('debug')('afm:kernel:daemons:util')

const araFilesystem = require('ara-filesystem')
const { createAFSKeyPath } = require('ara-filesystem/key-path')
const createContext = require('ara-context')
const path = require('path')
const request = require('request-promise')
const { urls } = require('k')

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
		const data = await araFilesystem.metadata.readFile({ did })
		if (data.fileInfo) {
			fileInfo = typeof data.fileInfo === 'string'
				? JSON.parse(data.fileInfo)
				: data.fileInfo
		}
	} catch (err) {
		debug('No metadata for %s', did)
	}
	return fileInfo
}

async function requestAraFaucet(userDID) {
	return await request.post({
		method: 'POST',
		uri: urls.ARA_FAUCET,
		body: { to: userDID },
		json: true
	})
}

async function requestEthFaucet(ethAddress) {
	return await request(urls.ETH_FAUCET + ethAddress)
}

async function requestFallbackEthFaucet(ethAddress) {
	return await request.post({
		method: 'POST',
		uri: urls.FALLBACK_ETH_FAUCET,
		body: { toWhom: ethAddress },
		json: true
	})
}

async function writeFileMetaData({
	did,
	size = 0,
	title = '',
	userDID = '',
	author = null,
	password
}) {
	try {
		const fileData = {
			author: author || userDID,
			size,
			title,
			timestamp: new Date
		}
		debug('Adding file metadata for %s', did)
		await araFilesystem.metadata.writeKey({ did, key: 'fileInfo', value: JSON.stringify(fileData), password })
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
	requestFallbackEthFaucet,
	writeFileMetaData
}