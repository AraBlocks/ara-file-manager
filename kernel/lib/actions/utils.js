'use strict'

const debug = require('debug')('acm:kernel:lib:actions:util')
const afs = require('ara-filesystem')
const araContractsManager = require('./araContractsManager')
const { AWAITING_DOWNLOAD, DOWNLOADED } = require('../../../lib/constants/stateManagement')
const { createAFSKeyPath } = require('ara-filesystem/key-path')
const path = require('path')
const fs = require('fs')
const farmConfig = require('ara-network-node-dcdn-farm/src/rc')()
const { farmerManager } = require('../actions')

async function descriptorGenerator(did, opts = {}) {
	try {
		did = did.slice(-64)
		const path = await makeAfsPath(did)
		const AFSExists = fs.existsSync(path)
		const meta = AFSExists ? await readFileMetadata(did) : null
		let price
		try { price = Number(await araContractsManager.getAFSPrice({ did })) }
		catch (err) {}
		const descriptor = {
			did,
			downloadPercent: AFSExists ? 1 : 0,
			datePublished: meta ? meta.timestamp : null,
			earnings: 0,
			name: meta ? meta.title : 'Unnamed File',
			peers: 0,
			price,
			path,
			shouldBroadcast: opts.shouldBroadcast == null ? farmerManager.getBroadcastingState({ did }) : false,
			size: meta ? meta.size : 0,
			status: AFSExists ? DOWNLOADED : AWAITING_DOWNLOAD
		}
		return { ...descriptor, ...opts }
	} catch (err) {
		debug('descriptorGenerator Error:, %o', err)
	}
}

function makeAfsPath(did) {
	return path.join(createAFSKeyPath(did), 'home', 'content')
}

async function readFileMetadata(did) {
	try {
		const data = await afs.metadata.readFile({ did })
		debug('Reading file metadata for %s', did)
		return JSON.parse(data.fileInfo)
	} catch (err) {
		debug('No metadata for %s', did)
		return null
	}
}

async function writeFileMetaData({ did, size, title, userDID = '' }) {
	try {
		const fileData = {
			author: userDID,
			size,
			title,
			timestamp: new Date
		}
		const fileDataString = JSON.stringify(fileData)
		debug('Adding file metadata for %s', did)
		afs.metadata.writeKey({ did, key: 'fileInfo', value: fileDataString })
	} catch (e) {
		debug(e)
	}
}

module.exports = {
	descriptorGenerator,
	makeAfsPath,
	readFileMetadata,
	writeFileMetaData
}