'use strict'

const debug = require('debug')('acm:kernel:lib:actions:farmerManager')
const actionsUtils = require('./utils')
const k = require('../../../lib/constants/stateManagement')
const dispatch = require('../reducers/dispatch')
const farmDCDN = require('ara-farming-dcdn/src/dcdn')
const fs = require('fs')
const path = require('path')
const rc = require('ara-farming-dcdn/src/rc')()

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

function getBroadcastingState({ did, dcdnFarmStore = {} }) {
  try {
		const fileData = dcdnFarmStore[did]
    return fileData ? JSON.parse(fileData).upload : false
  } catch (err) {
    return false
  }
}

function loadDcdnStore() {
	debug('loading dcdn farm store')
  try {
    const fileDirectory = rc.dcdn.config
    const data = fs.readFileSync(fileDirectory)
    const itemList = JSON.parse(data)
    return itemList
  } catch (err) {
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
	debug('Downloading through DCDN: %s', did)
	try {
		await farmer.join({
			did,
			download: true,
			upload: false,
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
			joinBroadcast({ farmer, did })
		})
		farmer.on('requestcomplete', (did) => {
			debug('Rewards allocated')
		})
	} catch (err) {
		debug('Error downloading: %O', err)
		errorHandler(did)
	}
}

function renameAfsFiles(did, fileName) {
	const afsFolderPath = actionsUtils.makeAfsPath(did)
	const afsFilePath = path.join(afsFolderPath, 'data')
	const newPath = path.join(afsFolderPath, fileName)
	fs.rename(afsFilePath, newPath, function (err) {
		if (err) {
			debug('some error occurred when renaming afs files')
		}
	})
}

module.exports = {
	createFarmer,
	download,
	getBroadcastingState,
	loadDcdnStore,
	joinBroadcast,
	stopAllBroadcast,
	unjoinBroadcast
}