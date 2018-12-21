'use strict'

const debug = require('debug')('acm:kernel:lib:actions:farmerManager')
const araContractsManager = require('./araContractsManager')
const { AutoQueue } = require('../../lib/')
const farmDCDN = require('ara-reward-dcdn/src/dcdn')
const { internalEmitter } = require('electron-window-manager')
const k = require('../../../lib/constants/stateManagement')
const fs = require('fs')

function createAutoQueue() {
	return new AutoQueue
}

function createFarmer({ did: userId, password, queue }) {
	debug('Creating Farmer')
	const farmer = new farmDCDN({ userId, password, queue })
	farmer.on('peer-update', (did, count) => {
		internalEmitter.emit(k.UPDATE_PEER_COUNT, {
			did,
			peers: count
		})
	})
	farmer.on('download-progress', (did, value, total) => {
		internalEmitter.emit(k.DOWNLOADING, {
			did,
			currentBlock: value,
			totalBlocks: total
		})
	})
	farmer.on('download-complete', (did) => {
		debug('Download complete!')
		internalEmitter.emit(k.DOWNLOADED, { did })
	})
	farmer.on('request-complete', (did) => {
		debug('Rewards allocated')
	})
	return farmer
}

async function joinBroadcast({ farmer, did }) {
	try {
		//Rewards set at 10% of AFS price
		await farmer.join({
			did,
			download: false,
			upload: true,
			price: await _calculateBudget(did)
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
	errorHandler
}) {
	debug('Downloading through DCDN: %s', did)
	try {
		await farmer.join({
			did,
			download: true,
			jobId,
			upload: true,
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
	createAutoQueue,
	createFarmer,
	download,
	getBroadcastingState,
	loadDCDNStore,
	joinBroadcast,
	stopAllBroadcast,
	unjoinBroadcast
}