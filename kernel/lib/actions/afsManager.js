'use strict'

const { DOWNLOADED } = require('../../../lib/constants/stateManagement')
const debug = require('debug')('acm:kernel:lib:actions:afsManager')
const { createAFSKeyPath } = require('ara-filesystem/key-path')
const araNetworkNodeDcdn = require('ara-network-node-dcdn')
const { createAFSKeyPath } = require('ara-filesystem/key-path')
const fs = require('fs')
const { getPrice, metadata, unarchive } = require('ara-filesystem')
const { publishDID } = require('ara-network-node-dcdn/subnet')
const path = require('path')
const windowManager = require('electron-window-manager')

const {
	getPrice,
	unarchive,
	metadata: {
		writeKey,
		readFile
	}
} = require('ara-filesystem')

const {
	account: {
		aid ,
		username
	}
} = windowManager.sharedData.fetch('store')

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
			identity: aid,
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
		const data = await readFile(did)
		debug('Read file metadata %O', data)
		return JSON.parse(data.fileInfo)
	} catch(e) {
		debug(e)
		return null
	}
}

async function writeFileMetaData({ did, title }) {
	try {
		const fileData = {
			title,
			timestamp: new Date,
			author: username
		}
		const fileDataString = JSON.stringify(fileData)
		debug('Adding file metadata %s', fileDataString)
		writeKey({ did, key: 'fileInfo', value: fileDataString })
	} catch(e) {
		debug(e)
	}
}

module.exports = {
	broadcast,
	download,
	getAFSPrice,
	makeAfsPath,
	readFileMetadata,
	unarchiveAFS,
	writeFileMetaData,
}