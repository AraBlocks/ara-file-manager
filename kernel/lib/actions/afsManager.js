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
	// // Create a swarm for uploading the content
	const fullDid = 'did:ara:' + did
	// console.log('broadcasting for ', fullDid)
	// const { afs } = await create({ did: fullDid }).catch((e) => {
	// 	console.log('Error creating afs when broadcasting', e)
	// })

	// // Join the discovery swarm for the requested content
	// const opts = {
	// 	stream: stream,
	// }
	// console.log('Creating swarm...')
	// const swarm = createSwarm(opts)
	// swarm.once('connection', handleConnection)
	// swarm.join(fullDid)
	// console.log('Joined Swarm')

	// function stream(peer) {
	// 	const stream = afs.replicate({
	// 		upload: true,
	// 		download: false,
	// 	})
	// 	stream.once('end', onend)
	// 	stream.peer = peer
	// 	return stream
	// }

	// async function onend() {
	// 	console.log(`Uploaded!`)
	// }

	// async function handleConnection(connection, info) {
	// 	handler()
	// 	console.log(`SWARM: New peer: ${info.host} on port: ${info.port}`)
	// }
	console.log('broadcasting.....')
	//console.log(araNetworkNodeDcdn)
	const { account: { aid } } = windowManager.sharedData.fetch('store')
	console.log(aid)
	try {
		araNetworkNodeDcdn.start({
			did: fullDid,
			download: false,
			upload: true,
		})

		publishDID(did, {
      // Identity of the user
      identity: aid,
      // Secret phrase given when creating network key
      secret: Buffer.from('ara-archiver'),
      name: 'remote1',
      // Path to public key of network key
      keys: path.resolve(`/Users/${process.argv[process.argv.length - 1]}/.ara/secret/ara-archiver.pub`),
    })
	} catch(e) {
		console.log(e)
	}

	///const exists = await checkBlockchain(fullDid)
  // if (true) {
	// 	console.log('hi')
  //   info(`Found ${did} on blockchain, starting DCDN`)
	// 	araNetworkNodeDcdn.start({
	// 		did: fullDid,
  //     download: false,
  //     upload: true,
  //   })
		
	// 	console.log('hi2')
  //   info(`Contacting subnet to start distributing ${did}`)
  //   araNetworkNodeDcdn.publishDID(did, {
  //     // Identity of the user
  //     identity: aid,
  //     // Secret phrase given when creating network key
  //     secret: Buffer.from('ara-archiver'),
  //     name: 'remote1',
  //     // Path to public key of network key
  //     keys: resolve('/Users/isabellee/.ara/secret/ara-archiver.pub'),
  //   })
  // } else {
	// 	error(`${argv.did} doesn't seem to exist. Try running \`afs commit ${argv.did}`)
	// }
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

	// console.log('Creating afs...')
	// // Create a swarm for downloading the content

	// const { afs } = await create({ did: fullDid }).catch(((err) => {
	// 	console.log({createErr: err})
	// 	errorHandler()
	// }))

	// afs.on('content', () => {
	// 	const feed = afs.partitions.resolve(afs.HOME).content
	// 	let prevPercent = 0
	// 	feed.on('download', () => {
	// 		const size = feed.byteLength
	// 		const total = feed.length
	// 		if (total) {
	// 			const downloaded = feed.downloaded()
	// 			const perc = downloaded / total
	// 			console.log({perc})
	// 			if (perc >= prevPercent + 0.04) {
	// 				prevPercent = perc
	// 				handler({ perc, size })
	// 			}
	// 		}
	// 	})
	// 	feed.on('sync', onend)
	// })

	// // Join the discovery swarm for the requested content
	// console.log('Waiting for peer connection...')
	// const opts = {
	// 	stream: stream,
	// }
	// const swarm = createSwarm(opts)
	// swarm.once('connection', handleConnection)
	// swarm.join(fullDid)

	// function stream(peer) {
	// 	const stream = afs.replicate({
	// 		upload: false,
	// 		download: true
	// 	})
	// 	stream.once('end', onend)
	// 	stream.peer = peer
	// 	return stream
	// }

	// async function onend() {
	// 	const files = await afs.readdir('.').catch(err => {
	// 		console.log({readdirErr: err})
	// 		errorHandler()
	// 	})
	// 	unarchiveAFS({ did, path: makeAfsPath(did) })
	// 	console.log({files})
	// 	console.log(`Downloaded!`)
	// 	afs.close()
	// 	swarm.destroy()
	// 	handler({ percentage: 1 })
	// 	console.log("Swarm destroyed")
	// }

	// async function handleConnection(connection, info) {
	// 	console.log(`SWARM: New peer: ${info.host} on port: ${info.port}`)
	// 	try {
	// 		await afs.download('.')
	// 	}
	// 	catch (err) {
	// 		console.log({downloadErr: err})
	// 		errorHandler()
	// 	}
	// }
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