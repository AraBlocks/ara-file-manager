const Socket = require('simple-websocket')

const socket = Socket('ws://localhost:24860')

socket.on('connect', () => {
  const item = JSON.stringify({
    title: 'The Room',
    license: 5,
    description: 'The best movie ever!'
  })
  socket.send(item)
})
