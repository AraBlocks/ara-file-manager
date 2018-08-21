'use strict'

const { app, globalShortcut } = require('electron')
const windowManager = require('../kernel/lib/lsWindowManager')
const isDev = require('electron-is-dev')
const path = require('path')
if (isDev) { require('./ipc-dev') }

let deepLinkingUrl

const shouldQuit = app.makeSingleInstance((argv, workingDirectory) => {
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
  windowManager.init()
  require('../kernel/lib/actionCreators')
  if (isDev) { require('electron-reload')(path.resolve('browser')) }
  require('./tray')()
  globalShortcut.register('CommandOrControl+/', () => {
    windowManager.getCurrent().object.openDevTools()
  })
  if (process.platform == 'win32') {
    deepLinkingUrl = process.argv.slice(1)
  }
  if (deepLinkingUrl) {
    windowManager.openDeepLinking(deepLinkingUrl)
  }
})
app.on('window-all-closed', () => { })

// For Deep Linking
app.setAsDefaultProtocolClient('lstr')
app.on('open-url', (event, url) => {
  event.preventDefault()
  deepLinkingUrl = url
  if (app.isReady()) {
    windowManager.openDeepLinking(url)
  }
})