'use strict'

const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const isDev = require('electron-is-dev')
const windowManager = require('electron-window-manager')
const app = express()

module.exports = () => {
  const corsOptions = cors({
    credentials: true,
    origin: 'http://localhost:3001'
  })
  app.use(corsOptions)
  app.use(bodyParser.json())
  app.post('/', (req, res) => {
    res.send('File info received!')
    const modalName = 'reDownloadModal'
    windowManager.sharedData.set('current', modalName)
    windowManager.createNew(
      modalName,
      modalName,
      windowManager.loadURL(modalName),
      false,
      {
        backgroundColor: 'white',
        frame: false,
        ...windowManager.setSize(modalName),
      },
      !isDev
    ).open()
    windowManager.fileInfo = req.body
  })
  app.listen(3002, () => console.log('Demo app listening on port 3002!'))
}