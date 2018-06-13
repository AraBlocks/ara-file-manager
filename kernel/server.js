'use strict'

const Server = require('simple-websocket/server')

const port = 24860
const server = new Server({ port })

server.on('connection', (socket) => {
  socket.on('data',  console.log)
})