'use strict'

const electron = require('electron')
const { app } = require('electron')
const windowManager = require('electron-window-manager')
const isDev = require('electron-is-dev')
const path = require('path')
const menuBarManager = require('../lib/menuBarManager')
require('./ipc-dev')
const index = `file://${path.resolve(__dirname, '..', 'browser/index.html')}`

app.on('ready', () => {
  windowManager.init()
  windowManager.open('home', 'Welcome', index, false, { showDevTools: true })
  if (isDev) { require('electron-reload')(path.resolve('browser')) }
  let menuManager = menuBarManager()
})