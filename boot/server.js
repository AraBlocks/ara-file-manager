'use strict'

const { getAFSPrice } = require('../kernel/lib/actions/afsManager')
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
    getAFSPrice({ did: req.body.aid, password: 'abc' }).then((price) => {
      const modalName = 'reDownloadModal'
      if (windowManager.get(modalName).object != null) { return }
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
        }
      ).open()
      windowManager.fileInfo = req.body
      windowManager.fileInfo.price = price
    }).catch(console.log)
  })
  app.listen(3002, () => console.log('Demo app listening on port 3002!'))
}