const debug = require('debug')('afm:kernel:lib:actions:farmerManager')

const farmDCDN = require('ara-base-dcdn/dcdn')
const fs = require('fs')
const { internalEmitter } = require('electron-window-manager')
const { stateManagement: k } = require('k')

const acmManager = require('./acmManager')

const mirror = require('mirror-folder')
const isFile = require('is-file')
const mkdirp = require('mkdirp')
const { access } = require('fs')
const pify = require('pify')

const {
  join,
  basename,
  resolve,
  relative
} = require('path')

async function add({ key, id, paths }) {
  const cfs = await this.create({ key, id })

  await mirrorPaths(paths)

  debug('full copy complete')
  debug(await cfs.readdir(cfs.HOME))

  return cfs

  async function mirrorPaths(p) {
    for (const path of p) {
      try {
        await pify(access)(resolve(path))
        await mirrorPath(path)
      } catch (err) {
        debug('%s does not exist', path)
      }
    }
  }

  async function mirrorPath(path) {
    debug(`copy start: ${path}`)
    const name = join(cfs.HOME, basename(path))
    // Check if file
    if (!(await pify(isFile)(path)) && !ignore(path)) {
      await pify(mkdirp)(name, { fs: cfs })
    }
    // Mirror and log
    const progress = mirror({ name: path }, { name, fs: cfs }, { keepExisting: true, ignore })
    progress.on('put', (src, dst) => {
      debug(`adding path ${dst.name}`)
    })
    progress.on('skip', (src, dst) => {
      debug(`skipping path ${dst.name}`)
    })
    progress.on('ignore', (src, dst) => {
      debug(`ignoring path ${dst.name}. Use '--force' to force add file`)
    })
    progress.on('del', (dst) => {
      debug(`deleting path ${dst.name}`)
    })

    // Await end or error
    const error = await new Promise((accept, reject) => progress.once('end', accept).once('error', reject))

    if (error) {
      debug(`copy error: ${path}: ${error}`)
    } else {
      debug(`copy complete: ${path}`)
    }
  }

  function ignore(path) {
    path = relative('/', path)
    if (ignored.ignores(path)) {
      if (force) {
        debug(`forcing add path ${path}`)
        return false
      }
      return true
    }
    return false
  }
}

function createFarmer({ did: userId, password, queue }) {
	debug('Creating Farmer')
	const farmer = new farmDCDN({ fs: { add } })
	farmer.on('peer-update', (did, count) => {
		debug('k.UPDATE_PEER_COUNT in farmerManager', did, count)
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

async function joinBroadcast({ farmer, did, id }) {
	try {
		console.log('doinBroadcast( did', did)
		await farmer.join({
			id,
			key: did,
			download: false,
			upload: true,
		})
		debug('Joining broadcast for %s', did.toString('hex'))
	} catch (err) {
		console.log('did', did)
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

module.exports = {
	createFarmer,
	download,
	getBroadcastingState,
	loadDCDNStore,
	joinBroadcast,
	stopAllBroadcast,
	unjoinBroadcast
}
