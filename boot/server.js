'use strict'

const Server = require('simple-websocket/server')
const port = 24860
const server = new Server({ port })

module.exports = () => {
  server.on('connection', (socket) => {
		console.log("Server Connected")
    socket.on('data', (data) => {
			console.log(JSON.parse(data.toString()))
    })
  })
}