'use strict'

const { app } = require('electron')
const windowManager = require('../kernel/lib/lsWindowManager')
const path = require('path')

app.on('ready', () => {
  require('electron-reload')(path.resolve('test'))

  windowManager.init()
  windowManager.open(
    'testing window',
    'testing',
    windowManager.loadURL('testing'),
    false,
    {
      ...windowManager.setSize('testing'),
      resizable: true,
      showDevTools: true
    }
  )
})
