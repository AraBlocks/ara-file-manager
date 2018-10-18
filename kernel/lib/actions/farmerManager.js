'use strict'

const debug = require('debug')('acm:kernel:lib:actions:farmerManager')
const dispatch = require('../reducers/dispatch')
const farmDCDN = require('ara-network-node-dcdn-farm/src/farmDCDN')
const afsManager = require('./afsManager')

function createFarmer({ did: userID, password }) {
	debug('Creating Farmer')
	return new farmDCDN({ userID, password })
}

function joinBroadcast({ farmer, did, price = 1 }) {
	try {
		farmer.join({
			did,
			download: false,
			upload: true,
			price
		})
		dispatch({ type: CHANGE_BROADCASTING_STATE, load: { did, shouldBroadcast: true } })
		debug('Joining broadcast for %s', did)
	} catch (err) {
		debug('Error joining broadcasting %O', err)
	}
}

function getBroadcastingState({ did, dcdnFarmStore = {} }) {
	debug('getting broadcasting state')
  try {
		const fileData = dcdnFarmStore[did]
		if (fileData == null) {
			return false
		}
    return JSON.parse(fileData).upload
  } catch (err) {
    return false
  }
}

function loadDcdnStore() {
	debug('loading dcdn farm store')
  try {
    const fileDirectory = farmConfig.dcdn.config
    const data = fs.readFileSync(fileDirectory)
    const itemList = JSON.parse(data)
    return itemList
  } catch (err) {
    debug('Can\'t load DCDN farm store')
    return {}
  }
}

function unjoinBroadcast({ farmer, did }) {
	debug('Unjoining broadcast for %s', did)
	try {
		farmer.unjoin({
			did
		})
		dispatch({ type: CHANGE_BROADCASTING_STATE, load: { did, shouldBroadcast: false } })
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
			joinBroadcast({ farmer, did })
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
	download,
	getBroadcastingState,
	loadDcdnStore,
	joinBroadcast,
	startBroadcast,
	stopAllBroadcast,
	unjoinBroadcast
}