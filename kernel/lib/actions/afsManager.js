'use strict'

const { create, getPrice, unarchive } = require('ara-filesystem')
const { createAFSKeyPath } = require('ara-filesystem/key-path')
const { createSwarm } = require('ara-network/discovery')
const fs = require('fs')
const path = require('path')

async function broadcast(did, handler) {
	// Create a swarm for uploading the content
	const fullDid = 'did:ara:' + did
	console.log('broadcasting for ', fullDid)
	const { afs } = await create({ did: fullDid }).catch((e) => {
		console.log(e)
		console.log('Error creating afs when broadcasting')
	})

	// Join the discovery swarm for the requested content
	const opts = {
		stream: stream,
	}
	console.log('Creating swarm...')
	const swarm = createSwarm(opts)
	swarm.once('connection', handleConnection)
	swarm.join(fullDid)
	console.log('Joined Swarm')

	function stream(peer) {
		const stream = afs.replicate({
			upload: true,
			download: false,
		})
		stream.once('end', onend)
		stream.peer = peer
		return stream
	}

	async function onend() {
		console.log(`Uploaded!`)
	}

	async function handleConnection(connection, info) {
		handler()
		console.log(`SWARM: New peer: ${info.host} on port: ${info.port}`)
	}
}

async function getAFSPrice({ did, password }) {
	result = await getPrice({ did, password })
}

async function download({ did, handler, errorHandler }) {
	console.log('Creating afs...')
	// Create a swarm for downloading the content
	const fullDid = 'did:ara:' + did
	const { afs } = await create({ did: fullDid }).catch(((err) => {
		console.log(err)
		errorHandler()
	}))

	afs.on('content', () => {
		const feed = afs.partitions.resolve(afs.HOME).content
		let prevPercent = 0
		feed.on('download', () => {
			const size = feed.byteLength
			console.log(size)
			const total = feed.length
			if (total) {
				const downloaded = feed.downloaded()
				const perc = downloaded / total
				if (perc >= prevPercent + 0.04) {
					prevPercent = perc
					handler({ perc, size })
				}
			}
		})
		feed.on('sync', onend)
	})

	// Join the discovery swarm for the requested content
	console.log('Waiting for peer connection...')
	const opts = {
		stream: stream,
	}
	const swarm = createSwarm(opts)
	swarm.once('connection', handleConnection)
	swarm.join(fullDid)

	function stream(peer) {
		const stream = afs.replicate({
			upload: false,
			download: true
		})
		stream.once('end', onend)
		stream.peer = peer
		return stream
	}

	async function onend() {
		const files = await afs.readdir('.').catch((e) => {
			console.log(e)
			errorHandler()
		})
		unarchiveAFS({ did, path: makeAfsPath(did) })
		console.log(files)
		console.log(`Downloaded!`)
		afs.close()
		swarm.destroy()
		handler({ percentage: 1 })
		console.log("Swarm destroyed")
	}

	async function handleConnection(connection, info) {
		console.log(`SWARM: New peer: ${info.host} on port: ${info.port}`)
		try {
			await afs.download('.')
		}
		catch (err) {
			console.log(`Error: ${err}`)
			errorHandler()
		}
	}
}

function makeAfsPath(aid) {
	return path.join(createAFSKeyPath(aid), 'home', 'content')
}

function unarchiveAFS({ did, path }) {
	try {
		unarchive({ did, path })
	} catch(err) {
		console.log(err)
	}
}

module.exports = {
	broadcast,
	download,
	getAFSPrice,
	makeAfsPath,
	unarchiveAFS,
}