'use strict'

const Server = require('simple-websocket/server')
const windowManager = require('electron-window-manager')
const port = 24860
const server = new Server({ port })

module.exports = () => {
  server.on('connection', (socket) => {
    console.log("Server Connected")
    socket.on('data', (data) => {
      console.log(JSON.parse(data.toString()))
      const modalName = 'reDownloadModal'
      windowManager.sharedData.set('current', modalName)
      windowManager.createNew(
        modalName,
        modalName,
        windowManager.loadURL(modalName),
        false,
        {
          frame: false,
          ...windowManager.setSize(modalName),
        }
      ).open()
      windowManager.fileInfo = JSON.parse(data.toString())
    })
  })
}