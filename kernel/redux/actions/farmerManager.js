'use strict'

const debug = require('debug')('acm:kernel:lib:actions:farmerManager')
const araContractsManager = require('./araContractsManager')
const farmDCDN = require('ara-reward-dcdn/src/dcdn')
const fs = require('fs')

function createFarmer({ did: userId, password }) {
	debug('Creating Farmer')
	return new farmDCDN({ userId, password })
}

async function joinBroadcast({ farmer, did, updatePeerCount }) {
	try {
		//Rewards set at 10% of AFS price
		await farmer.join({
			did,
			download: false,
			upload: true,
			price: await _calculateBudget(did)
		})
		farmer.on('peer-update', (did, count) => {
			console.log('peer count updated !')
			console.log(count)

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
	} catch (err) {
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
	jobId = null,
	maxPeers = 10,
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
			maxPeers,
			jobId,
			upload: true,
		})

		let prevPercent = 0
		farmer.on('download-progress', (did, value, total) => {
			const perc = value / total
			const size = total * 6111 * 10
			if (perc >= prevPercent + 0.1) {
				prevPercent = perc
				if (value / total != 1) {
					progressHandler({ downloadPercent: value / total, did, size })
				}
			}
		})
		farmer.on('download-complete', (did) => {
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

async function _calculateBudget(did) {
	let budget
	try {
		budget = (await araContractsManager.getAFSPrice({ did })) / 10
	} catch (err) {
		debug('Err getting AFS price: %o', err)
		budget = 0
	}

	return budget
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