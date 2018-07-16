'use strict'

const { app } = require('electron')
const windowManager = require('../kernel/lib/lsWindowManager')
const isDev = require('electron-is-dev')
const path = require('path')
require('./ipc-dev')

app.on('ready', () => {
  windowManager.init()
  windowManager.sharedData.set('store', require('./store'))
  if (isDev) { require('electron-reload')(path.resolve('browser')) }
  require('./tray')()
})

app.on('window-all-closed', () =>{})