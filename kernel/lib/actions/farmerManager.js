'use strict'

const debug = require('debug')('acm:kernel:lib:actions:farmerManager')
const farmDCDN = require('ara-farming-dcdn/src/dcdn')
const fs = require('fs')

function createFarmer({ did: userID, password }) {
	debug('Creating Farmer')
	return new farmDCDN({ userID, password })
}

async function joinBroadcast({ farmer, did, price = 1 }) {
	try {
		await farmer.join({
			did,
			download: false,
			upload: true,
			price
		})
		debug('Joining broadcast for %s', did)
	} catch (err) {
		debug('Error joining broadcasting %O', err)
	}
}

function getBroadcastingState({ did, DCDNStore }) {
  try {
    return JSON.parse(DCDNStore[did]).upload
  } catch (err) {
    return false
  }
}

function loadDCDNStore(farmer) {
	debug('loading dcdn farm store')
  try {
		return JSON.parse(fs.readFileSync(farmer.config).toString())
  } catch (err) {
		debug(err)
    debug('No DCDN farm store')
    return {}
  }
}

async function unjoinBroadcast({ farmer, did }) {
	debug('Unjoining broadcast for %s', did)
	try {
		await farmer.unjoin({ did })
	} catch(err) {
		debug('Error stopping broadcast for %s: %O', did, err)
	}
}

async function stopAllBroadcast(farmer) {
	debug('Stopping DCDN broadcast')
	if (farmer == null) { return }
	try {
		await farmer.stop()
	} catch (e) {
		debug(e)
	}
}

async function download({
	farmer,
	did,
	jobId,
	maxPeers = 1,
	price = 1,
	errorHandler,
	startHandler,
	progressHandler,
	completeHandler
}) {
	debug('Downloading Metadata through DCDN: %s', did)
	try {
		await farmer.join({
			did,
			download: true,
			upload: false,
			price,
			maxPeers,
			metaOnly: true,
			jobId: jobId ? jobId.slice(2) : null
		})

		farmer.once('start', (did, total) => {
			debug('Start downloading metadata')
		})

		farmer.once('requestcomplete', async (did) => {
			debug('Metadata download complete!')
			setTimeout( async () => {
				debug('about to start download content')
				await downloadContent({
					farmer,
					did,
					jobId,
					maxPeer,
					price,
					errorHandler,
					startHandler,
					progressHandler,
					completeHandler
				})
			}, 5000)
		})
	} catch (err) {
		debug('Error downloading metadata: %O', err)
		errorHandler(did)
	}
}

async function downloadContent({
	farmer,
	did,
	jobId,
	maxPeers = 1,
	price = 1,
	errorHandler,
	startHandler,
	progressHandler,
	completeHandler
}) {
	debug('Downloading through DCDN: %s', did)
	try {
		await farmer.join({
			did,
			download: true,
			upload: true,
			price,
			maxPeers,
			jobId: jobId ? jobId.slice(2) : null
		})

		let totalBlocks = 0
		let prevPercent = 0
		farmer.on('start', (did, total) => {
			debug('Starting download', total)
			const size = total * 6111 * 10
			startHandler({ did, size })
			totalBlocks = total
		})
		farmer.on('progress', (did, value) => {
			const perc = value / totalBlocks
			if (perc >= prevPercent + 0.1) {
				prevPercent = perc
				if (value / totalBlocks != 1) {
					progressHandler({ downloadPercent: value / totalBlocks, did })
				}
			}
		})
		farmer.on('complete', (did) => {
			debug('Download complete!')
			completeHandler(did)
		})
		farmer.on('requestcomplete', (did) => {
			debug('Rewards allocated')
		})
	} catch (err) {
		debug('Error downloading: %O', err)
		errorHandler(did)
	}
}

module.exports = {
	createFarmer,
	download,
	getBroadcastingState,
	loadDCDNStore,
	joinBroadcast,
	stopAllBroadcast,
	unjoinBroadcast
}