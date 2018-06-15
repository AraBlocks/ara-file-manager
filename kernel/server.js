'use strict'

const Server = require('simple-websocket/server')
const ipc = require('electron').ipcMain
const { kPurchaseRequest } = require('../lib/ipc')

const port = 24860
const server = new Server({ port })

module.exports = (window) => {
  server.on('connection', (socket) => {

    socket.on('data', (data) => window.webContents.send(kPurchaseRequest, JSON.parse(data.toString())))
  })
}