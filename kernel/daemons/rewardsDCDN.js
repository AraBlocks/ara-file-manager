const debug = require('debug')('ara:fm:kernel:daemons:farmerManager')

const { events } = require('k')
const farmDCDN = require('ara-reward-dcdn/src/dcdn')
const fs = require('fs')
const { internalEmitter } = require('electron-window-manager')

function createFarmer({ did: userId, password, queue }) {
  debug('Creating Farmer')
  const farmer = new farmDCDN({ userId, password, queue })
  farmer.on('peer-update', (did, count) => {
    debug('events.UPDATE_PEER_COUNT in farmerManager', did, count)
    internalEmitter.emit(events.UPDATE_PEER_COUNT, {
      did,
      peers: count
    })
  })
  farmer.on('download-progress', (did, value, total, byteLength) => {
    internalEmitter.emit(events.DOWNLOADING, {
      did: Buffer.from(did, 'hex').toString('hex'),
      currentBlock: value,
      totalBlocks: total,
      byteLength
    })
  })
  farmer.on('download-complete', (did) => {
    debug('Download complete!')
    internalEmitter.emit(events.DOWNLOADED, { did })
  })
  farmer.on('request-complete', (did) => {
    debug('Rewards allocated')
  })
  return farmer
}

async function joinBroadcast({ farmer, did }) {
  try {
    await farmer.join({
      did,
      download: false,
      upload: true,
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
      did: Buffer.from(did, 'hex').toString('hex'),
      download: true,
      jobId,
      upload: false,
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
