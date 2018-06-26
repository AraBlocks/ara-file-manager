const Socket = require('simple-websocket')

const socket = Socket('ws://localhost:24860')

console.log('starting mockDapp')
socket.on('connect', () => {
  const item = JSON.stringify({
    title: 'The Room',
    license: 5,
    description: 'The best movie ever!',
    price: 33
  })
  socket.send(item)
})