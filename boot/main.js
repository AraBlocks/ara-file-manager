'use strict'

const debug = require('debug')('acm:boot:main')
const { app, globalShortcut } = require('electron')
const windowManager = require('../kernel/lib/lsWindowManager')
const isDev = require('electron-is-dev')
const fs = require('fs')
const path = require('path')
const userHome = require('user-home')
//Creates dev view
isDev && require('./ipc-dev')

let deepLinkingUrl

const shouldQuit = app.makeSingleInstance(argv => {
  if (process.platform == 'win32') {
    deepLinkingUrl = argv.slice(1)
  }
})

if (shouldQuit) {
  app.quit()
  return
}

app.setName('Ara Content Manager')
app.on('ready', () => {
  debug('App initialzed')
  windowManager.init()
  //Creates tray menu
  require('./tray').buildTray()
  debug('Creating menu')
  require('./menu')()
  debug('Loading Dependencies')
  require('../kernel/lib/actionCreators')

  //Registers command/control + \ to open dev tools
  globalShortcut.register('CommandOrControl+\\', () => windowManager.getCurrent().object.openDevTools())
  if (process.platform == 'win32') { deepLinkingUrl = process.argv.slice(1) }
  deepLinkingUrl && windowManager.openDeepLinking(deepLinkingUrl)
  //Hot reloads browser side changes
  isDev && require('electron-reload')(path.resolve('browser'))
})
//Prevents app from closing when all windows are shut
app.on('window-all-closed', () => {})

// For Deep Linking
app.setAsDefaultProtocolClient('lstr')
app.on('open-url', (event, url) => {
  event.preventDefault()
  deepLinkingUrl = url
  app.isReady() && windowManager.openDeepLinking(url)
})

app.on('before-quit', () => {
  const { farmerManager } = require('../kernel/lib/actions')
  const { farmer : { farm } } = require('../kernel/lib/store')
  farmerManager.stopAllBroadcast(farm)
})