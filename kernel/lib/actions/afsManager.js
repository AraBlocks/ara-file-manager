const { create } = require('ara-filesystem')
const { createSwarm } = require('ara-network/discovery')

broadcast('did:ara:7b30505d6fc335770237936bba6a0d0a62d49e792bc555746e49fdda880c7b39')
async function broadcast (did) {
    // Create a swarm for uploading the content
    const { afs } = await create({did})

    // Join the discovery swarm for the requested content
    const opts = {
        stream: stream,
    }
    const swarm = createSwarm(opts)
    swarm.on('connection', handleConnection)
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

   async function onend(){
        console.log(`Uploaded!`)
   }

    async function handleConnection(connection, info){
        console.log(`SWARM: New peer: ${info.host} on port: ${info.port}`)
    }
}

async function download ({did, handler}) {
	console.log('Creating afs...')
	// Create a swarm for downloading the content
	const { afs } = await create({did})

	// Join the discovery swarm for the requested content
	console.log('Waiting for peer connection...')
    const opts = {
        stream: stream,
    }
    const swarm = createSwarm(opts)
    swarm.on('connection', handleConnection)
    swarm.join(did)

   function stream(peer) {
       const stream = afs.replicate({
            upload: false,
            download: true
       })
       stream.once('end', onend)
       stream.peer = peer
       return stream
   }

   async function onend(){
       console.log(await afs.readdir('.'))
       console.log(`Downloaded!`)
        afs.close()
        swarm.destroy()
        console.log("Swarm destroyed")
        handler()
    }

    async function handleConnection(connection, info){
        console.log(`SWARM: New peer: ${info.host} on port: ${info.port}`)
        try {
            await afs.download('.')
        }
        catch (err) {
            console.log(`Error: ${err}`)
        }
    }
}

module.exports = {
	broadcast,
	download
}