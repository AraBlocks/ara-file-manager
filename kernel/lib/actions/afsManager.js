'use strict'

const debug = require('debug')('acm:kernel:lib:actions:afsManager')
const { AWAITING_DOWNLOAD, DOWNLOADED } = require('../../../lib/constants/stateManagement')
const { createAFSKeyPath } = require('ara-filesystem/key-path')
const araNetworkNodeDcdn = require('ara-network-node-dcdn')
const fs = require('fs')
const { getPrice, metadata, unarchive } = require('ara-filesystem')
const { publishDID } = require('ara-network-node-dcdn/subnet')
const path = require('path')
const windowManager = require('electron-window-manager')
const { account } = windowManager.sharedData.fetch('store')

async function broadcast(did) {
	const fullDid = 'did:ara:' + did
	debug('Broadcasting for %s', fullDid)
	try {
		araNetworkNodeDcdn.start({
			did: fullDid,
			download: false,
			upload: true,
		})

		publishDID(did, {
			identity: account.aid.ddo.id,
			secret: Buffer.from('ara-archiver'),
			name: 'remote1',
			keys: path.resolve(`/Users/${process.argv[process.argv.length - 1]}/.ara/secret/ara-archiver.pub`),
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

async function download({ did, handler, errorHandler }) {
	debug('Downloading through DCDN: %s', did)
	const fullDid = 'did:ara:' + did
	try {
		araNetworkNodeDcdn.start({
			did: fullDid,
			download: true
		})
	} catch (err) {
		debug('Error downloading: %O', err)
	}
}

function makeAfsPath(aid) {
	return path.join(createAFSKeyPath(aid), 'home', 'content')
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
		debug(err)
		debug('No metadata for %s', did)
		return null
	}
}

async function writeFileMetaData({ did, title }) {
	try {
		const fileData = {
			title,
			timestamp: new Date,
			author: account.username
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

async function descriptorGenerator (did, deeplinkData = null) {
  try {
    did = did.slice(-64)
    const path = await makeAfsPath(did)
    const AFSexists = fs.existsSync(path)
    const meta = await readFileMetadata(did)

    const descriptor = {}
    descriptor.downloadPercent = AFSexists ? 1 : 0
    descriptor.meta = {
      aid: 'did:ara:' + did,
      datePublished: meta ? meta.timestamp : null,
      earnings: 0,
      peers: 0,
			price: Number(await getAFSPrice({ did }))
    }
    descriptor.name = meta ? meta.title : deeplinkData ? deeplinkData.title : 'Unnamed File'
    descriptor.size = 0
		descriptor.status = AFSexists ? DOWNLOADED : AWAITING_DOWNLOAD
		descriptor.path = path

    return descriptor
  } catch (err) {
    debug('Error:, %o', err)
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