const { create } = require('ara-filesystem')
const { createAFSKeyPath } = require('ara-filesystem/key-path')
const { createSwarm } = require('ara-network/discovery')
const fs = require('fs')
const path = require('path')

async function broadcast(did) {
	// Create a swarm for uploading the content
	const fullDid = 'did:ara:' + did
	console.log('broadcasting for ', fullDid)
	const { afs } = await create({ did: fullDid })

	// Join the discovery swarm for the requested content
	const opts = {
		stream: stream,
	}
	const swarm = createSwarm(opts)
	swarm.once('connection', handleConnection)
	swarm.join(fullDid)

	function stream(peer) {
		const stream = afs.replicate({
			upload: true,
			download: false
		})
		stream.once('end', onend)
		stream.peer = peer
		return stream
	}

	async function onend() {
		console.log(`Uploaded!`)
	}

	async function handleConnection(connection, info) {
		console.log(`SWARM: New peer: ${info.host} on port: ${info.port}`)
	}
}

async function download({ did, handler }) {
	console.log('Creating afs...')
	// Create a swarm for downloading the content
	const fullDid = 'did:ara:' + did
	const { afs } = await create({ did: fullDid })

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
		const files = await afs.readdir('.')
		renameAfsFiles(did, files[0])
		console.log(files)
		console.log(`Downloaded!`)
		afs.close()
		swarm.destroy()
		handler()
		console.log("Swarm destroyed")
	}

	async function handleConnection(connection, info) {
		console.log(`SWARM: New peer: ${info.host} on port: ${info.port}`)
		try {
			await afs.download('.')
		}
		catch (err) {
			console.log(`Error: ${err}`)
		}
	}
}

function getAfsPath(aid) {
	return path.join(createAFSKeyPath(aid), 'home', 'content')
}

function renameAfsFiles(aid, fileName) {
	const afsFolderPath = getAfsPath(aid)
	const afsFilePath = path.join(afsFolderPath, 'data')
	const newPath = path.join(afsFolderPath, fileName)
	fs.rename(afsFilePath, newPath, function(err) {
		if (err) {
			console.log('some error occurred when renaming afs files')
		}
	})
}

module.exports = {
	broadcast,
	download,
	getAfsPath
}