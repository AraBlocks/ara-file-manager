'use strict'

const { app } = require('electron')
const windowManager = require('electron-window-manager')
const isDev = require('electron-is-dev')
const path = require('path')
require('./ipc-dev')

app.on('ready', () => {
  windowManager.init()
  if (isDev) { require('electron-reload')(path.resolve('browser')) }
  require('./tray')()
})

app.on('window-all-closed',() =>{})