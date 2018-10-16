'use strict'

const debug = require('debug')('acm:kernel:lib:actions:farmerManager')
const farmDCDN = require('ara-network-node-dcdn-farm/src/farmDCDN')
const afsManager = require('./afsManager')
const windowManager = require('electron-window-manager')
function createFarmer({ did: userID, password }) {
	debug('Creating Farmer')
	return new farmDCDN({ userID, password })
}

async function joinBroadcast({ farmer, did, price = 1 }) {
	try {
		farmer.join({
			did,
			download: false,
			upload: true,
			price
		})
		debug('Broadcasting for %s', did)
	} catch (err) {
		debug('Error broadcasting %O', err)
	}
}

async function broadcastAll(farmer) {
	try {
		debug('Broadcasting all afses')
		const { files } = windowManager.sharedData.fetch('store')
		const didList = files.published.filter(file => file.shouldBroadcast).map(file => file.did)
		didList.forEach(did => {
			broadcast({ farmer, did })
		})
	} catch(err) {
		debug(err)
	}
}

async function unjoinBroadcast({ farmer, did }) {
	try {
		farmer.unjoin({
			did
		})
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

function startBroadcast(farmer) {
	debug('Starting DCDN broadcast')
	farmer.start()
}

async function download({
	farmer,
	errorHandler,
	did,
	handler,
	maxPeers = 1,
	price = 1
}) {
	debug('Downloading through DCDN: %s', did)
	try {
		await farmer.join({
			did,
			download: true,
			upload: false,
			price,
			maxPeers
		})

		let totalBlocks = 0
		let prevPercent = 0
		farmer.on('start', (did, total) => {
			debug('Starting download', total)
			const size = total * 6111 * 10
			handler({ did, size })
			totalBlocks = total
		})
		farmer.on('progress', (did, value) => {
			const perc = value / totalBlocks
			if (perc >= prevPercent + 0.1) {
				prevPercent = perc
				if (value / totalBlocks != 1) {
					handler({ downloadPercent: value / totalBlocks, aid: did })
				}
			}
		})
		farmer.on('complete', (did) => {
			debug('Download complete!')
			handler({ downloadPercent: 1, did })
			afsManager.renameAfsFiles(did, 'movie.mov')
		})
		farmer.on('requestcomplete', (did) => {
			debug('Rewards allocated')
		})
	} catch (err) {
		debug('Error downloading: %O', err)
		errorHandler()
	}
}

module.exports = {
	createFarmer,
	joinBroadcast,
	broadcastAll,
	startBroadcast,
	stopAllBroadcast,
	joinBroadcast,
	unjoinBroadcast,
	download
}