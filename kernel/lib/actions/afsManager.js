const { create } = require('ara-filesystem')
const { createSwarm } = require('ara-network/discovery')

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
    swarm.once('connection', handleConnection)
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
       handler()
        console.log("Swarm destroyed")
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