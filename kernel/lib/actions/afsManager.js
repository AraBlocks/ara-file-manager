'use strict'

const debug = require('debug')('acm:kernel:lib:actions:afsManager')
const { AWAITING_DOWNLOAD, DOWNLOADED } = require('../../../lib/constants/stateManagement')
const araNetworkNodeDcdn = require('ara-network-node-dcdn')
const dcdnFarm = require('ara-network-node-dcdn-farm')
const { createAFSKeyPath } = require('ara-filesystem/key-path')
const fs = require('fs')
const { getPrice, metadata, unarchive } = require('ara-filesystem')
const { publishDID } = require('ara-network-node-dcdn/subnet')
const path = require('path')
const windowManager = require('electron-window-manager')
const { account } = windowManager.sharedData.fetch('store')


async function broadcast({ did , price = 0}) {
	debug('Broadcasting for %s', did)
	try {
		araNetworkNodeDcdnFarm.start({
			did,
			download: false,
			upload: true,
			userID: account.userDID,
			price,
		})
	} catch (err) {
		debug('Error broadcasting %O', err)
	}
}

async function getAFSPrice({ did, password }) {
	debug('Getting price for %s', did)
	const result = await getPrice({ did, password })
	return result
}

async function download({
	errorHandler,
	did,
	handler,
	maxWorkers = 1,
	price = 1
}) {
	debug('Downloading through DCDN: %s', did)
	try {
		await araNetworkNodeDcdnFarm.start({
			did: did,
			download: true,
			upload: false,
			userID: '0c354f916a8c6059ab4d726eed4f9f2bf47db09f01c4f4111822483ccede7cf8',
			price,
			maxWorkers
		})
		const dcdn = await araNetworkNodeDcdnFarm.getInstance()
		let totalBlocks = 0
		let prevPercent = 0
		dcdn.on('start', (did, total) => totalBlocks = total)
		dcdn.on('progress', (did, value) => {
			const perc = value/totalBlocks
			if (perc >= prevPercent + 0.04) {
				prevPercent = perc
				if (value/totalBlocks != 1) {
					handler({ downloadPercent: value/totalBlocks, aid: did })
				}
			}
		})
		dcdn.user.on('complete', () => {
			handler({ downloadPercent: 1, aid: did })
		})
	} catch (err) {
		debug('Error downloading: %O', err)
	}
}

function unarchiveAFS({ did, path }) {
	debug('Unarchiving %o', { did, path })
	unarchive({ did, path })
}

async function readFileMetadata(did) {
	try {
		const data = await metadata.readFile({ did })
		debug('Read file metadata %O', data)
		return JSON.parse(data.fileInfo)
	} catch (err) {
		debug('No metadata for %s', did)
		return null
	}
}

async function writeFileMetaData({ did, size, title }) {
	try {
		const fileData = {
			author: account.username,
			size,
			title,
			timestamp: new Date,
		}
		const fileDataString = JSON.stringify(fileData)
		debug('Adding file metadata %s', fileDataString)
		metadata.writeKey({ did, key: 'fileInfo', value: fileDataString })
	} catch (e) {
		debug(e)
	}
}

async function surfaceAFS(items) {
	return Promise.all(items.map(item => descriptorGenerator(item)))
}

function makeAfsPath(did) {
	return path.join(createAFSKeyPath(did), 'home', 'content')
}

async function descriptorGenerator(did, deeplinkData = null) {
	try {
		did = did.slice(-64)
		const path = await makeAfsPath(did)
		const AFSExists = fs.existsSync(path)
		const meta = AFSExists ? await readFileMetadata(did) : null

		const descriptor = {}
		descriptor.downloadPercent = AFSExists ? 1 : 0
		descriptor.meta = {
			aid: did,
			datePublished: meta ? meta.timestamp : null,
			earnings: 0,
			peers: 0,
			price: Number(await getAFSPrice({ did }))
		}
		descriptor.name = meta ? meta.title : deeplinkData ? deeplinkData.title : 'Unnamed File'
		descriptor.size = meta ? meta.size : 0
		descriptor.status = AFSExists ? DOWNLOADED : AWAITING_DOWNLOAD
		descriptor.path = path

		return descriptor
	} catch (err) {
		debug('descriptorGenerator Error:, %o', err)
	}
}

module.exports = {
	broadcast,
	descriptorGenerator,
	download,
	getAFSPrice,
	makeAfsPath,
	readFileMetadata,
	surfaceAFS,
	unarchiveAFS,
	writeFileMetaData,
}