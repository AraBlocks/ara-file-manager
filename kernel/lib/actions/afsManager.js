'use strict'

const { create, getPrice, unarchive } = require('ara-filesystem')
const { createAFSKeyPath } = require('ara-filesystem/key-path')
const araNetworkNodeDcdn = require('ara-network-node-dcdn')
const { publishDID } = require('ara-network-node-dcdn/subnet')
const { createSwarm } = require('ara-network/discovery')
const fs = require('fs')
const path = require('path')
const windowManager = require('electron-window-manager')

async function broadcast(did, handler) {
	const fullDid = 'did:ara:' + did
	console.log(`broadcasting..${fullDid}`)
	const { account: { aid } } = windowManager.sharedData.fetch('store')
	console.log(aid)
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
	} catch(e) {
		console.log(e)
	}
}

async function getAFSPrice({ did, password }) {
	const result = await getPrice({ did, password })
	return result
}

async function download({ did, handler, errorHandler }) {
	const fullDid = 'did:ara:' + did
	try {
		araNetworkNodeDcdn.start({
			did: fullDid,
			download: true
		})
	} catch(e) {
		console.log(e)
	}
}

function makeAfsPath(aid) {
	return path.join(createAFSKeyPath(aid), 'home', 'content')
}

function unarchiveAFS({ did, path }) {
	try {
		unarchive({ did, path })
	} catch(err) {
		console.log({unarchiveErr: err})
	}
}

module.exports = {
	broadcast,
	download,
	getAFSPrice,
	makeAfsPath,
	unarchiveAFS,
}