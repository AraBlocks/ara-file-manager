'use strict'

const debug = require('debug')('acm:kernel:lib:actions:afsManager')
const {
	getPrice,
	unarchive,
	metadata: {
		writeKey,
		readFile
	}
} = require('ara-filesystem')
const { createAFSKeyPath } = require('ara-filesystem/key-path')
const araNetworkNodeDcdn = require('ara-network-node-dcdn')
const { publishDID } = require('ara-network-node-dcdn/subnet')
const path = require('path')
const windowManager = require('electron-window-manager')

async function broadcast(did) {
	const fullDid = 'did:ara:' + did
	debug('Broadcasting for %s', fullDid)
	const { account: { aid } } = windowManager.sharedData.fetch('store')
	try {
		araNetworkNodeDcdn.start({
			did: fullDid,
			download: false,
			upload: true,
		})

		publishDID(did, {
      identity: aid,
      secret: Buffer.from('ara-archiver'),
      name: 'remote1',
      keys: path.resolve(`/Users/${process.argv[process.argv.length - 1]}/.ara/secret/ara-archiver.pub`),
    })
	} catch(err) {
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
	} catch(err) {
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

async function writeMetadata({ did, key, value }) {
	try {
		const updatedKeys = await writeKey({ did, key, value })
		debug('Wrote key to metadata: %O', updatedKeys)
	} catch(err) {
		debug('Error writing key to metadata: %O', err)
	}
}

async function readMetadata(did) {
	try {
		const data = await readFile(did)
		debug('Read metadata: %O', data)
		return data
	} catch(err) {
		debug('Error reading metadata: %O')
	}
}

module.exports = {
	broadcast,
	download,
	getAFSPrice,
	makeAfsPath,
	readMetadata,
	unarchiveAFS,
	writeMetadata
}