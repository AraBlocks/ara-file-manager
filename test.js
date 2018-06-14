const Socket = require('simple-websocket')

const socket = Socket('ws://localhost:24860')

socket.on('connect', () => {
  socket.send('!')
})
