'use strict'

const debug = require('debug')('acm:kernel:lib:actions:util')
const k = require('../../../lib/constants/stateManagement')
const afs = require('ara-filesystem')
const araContractsManager = require('./araContractsManager')
const araUtil = require('ara-util')
const { createAFSKeyPath } = require('ara-filesystem/key-path')
const path = require('path')
const fs = require('fs')
const createContext = require('ara-context')

//TODO: figure out why reading metadata causes error for uncommitted afs
async function descriptorGenerator(did, opts = {}) {
	debug('descripty', did)
	try {
		did = araUtil.getIdentifier(did)
		const AFSPath = await makeAfsPath(did)
		const AFSExists = fs.existsSync(AFSPath)
		const meta = AFSExists ? await readFileMetadata(did) : null

		const descriptor = {
			allocatedRewards: 0,
			did,
			downloadPercent: AFSExists ? 1 : 0,
			datePublished: meta ? meta.timestamp : null,
			earnings: 0,
			name: meta ? meta.title : null,
			owner: false,
			path: AFSPath,
			peers: 0,
			price: Number(await araContractsManager.getAFSPrice({ did })),
			redeeming: false,
			shouldBroadcast: false,
			size: meta ? meta.size : 0,
			status: AFSExists ? k.DOWNLOADED_PUBLISHED : k.AWAITING_DOWNLOAD
		}
		debug('descripty done', did)
		return Object.assign(descriptor, opts)
	} catch (err) {
		debug('descriptorGenerator Error:, %o', err)
	}
}

async function getNetwork() {
	const ctx = createContext()
	await ctx.ready()
	const { web3 } = ctx

	const networkType =  await web3.eth.net.getNetworkType()

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
	descriptorGenerator,
	getNetwork,
	makeAfsPath,
	readFileMetadata,
	writeFileMetaData
}