const { create } = require('ara-filesystem')
const { createAFSKeyPath } = require('ara-filesystem/key-path')
const { createSwarm } = require('ara-network/discovery')
const fs = require('fs')
const path = require('path')

broadcast('did:ara:d642743e1ca0de760498d8d8eb37e34f2d9b4a7c918fa622d3cef78b73c3eb2e')
async function broadcast (did) {
    // Create a swarm for uploading the content
    const { afs } = await create({did})

    // Join the discovery swarm for the requested content
    const opts = {
        stream: stream,
    }
    const swarm = createSwarm(opts)
    swarm.once('connection', handleConnection)
    swarm.join(did)

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
	const { afs } = await create({ did })

	// Join the discovery swarm for the requested content
	console.log('Waiting for peer connection...')
    const opts = {
        stream: stream,
    }
    const swarm = createSwarm(opts)
    swarm.once('connection', handleConnection)
    swarm.join(did)

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
	const aidHash = aid.slice(8)
	const afsFolderPath = getAfsPath(aidHash)
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