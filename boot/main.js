'use strict'

const { app } = require('electron')
const windowManager = require('../kernel/lib/lsWindowManager')
const isDev = require('electron-is-dev')
const path = require('path')

if (isDev) { require('./ipc-dev') }

app.on('ready', () => {
  windowManager.init()
  require('../kernel/lib/actionCreators')
  if (isDev) { require('electron-reload')(path.resolve('browser')) }
  require('./tray')()
  require('./server')()
  require('../kernel/lib/actions/writeSecrets')()
})

app.on('window-all-closed', () =>{})