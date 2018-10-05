'use strict'

const debug = require('debug')('acm:kernel:lib:actions:util')
const afs = require('ara-filesystem')
const araContractsManager = require('./araContractsManager')
const { AWAITING_DOWNLOAD, DOWNLOADED, PUBLISHING } = require('../../../lib/constants/stateManagement')
const { createAFSKeyPath } = require('ara-filesystem/key-path')
const path = require('path')
const fs = require('fs')

async function descriptorGenerator(did) {
	try {
		did = did.slice(-64)
		const path = await makeAfsPath(did)
		const AFSExists = fs.existsSync(path)
		const meta = AFSExists ? await readFileMetadata(did) : null
		const descriptor = {
			did,
			downloadPercent: AFSExists ? 1 : 0,
			datePublished: meta ? meta.timestamp : null,
			earnings: 0,
			name: meta ? meta.title : 'Unnamed File',
			peers: 0,
			price: Number(await araContractsManager.getAFSPrice({ did })),
			path,
			size: meta ? meta.size : 0,
			status: AFSExists ? DOWNLOADED : AWAITING_DOWNLOAD
		}
		return descriptor
	} catch (err) {
		debug('descriptorGenerator Error:, %o', err)
	}
}

async function descriptorGeneratorPublishing({ did, name, price, size}) {
	try {
		did = did.slice(-64)
		const path = await makeAfsPath(did)
		const descriptor = {
			did,
			downloadPercent: 1,
			datePublished: new Date,
			name,
			peers: 0,
			price,
			path,
			size,
			status: PUBLISHING
		}
		return descriptor
	} catch (err) {
		debug('descriptorGeneratorPublishing Error:, %o', err)
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
	descriptorGeneratorPublishing,
	makeAfsPath,
	readFileMetadata,
	writeFileMetaData
}