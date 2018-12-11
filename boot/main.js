'use strict'

const debug = require('debug')('acm:boot:main')
const writeFiles = require('./writeFiles')
//Writes .ara and keyrings if doesn't exist
if (writeFiles.writeAraRC() === false) { debug('.ararc exists, not writing file') }

const { app, globalShortcut } = require('electron')
const windowManager = require('../kernel/lib/lsWindowManager')
const { application } = require('../lib/constants/index')
const analytics = require('../kernel/lib/actions/analytics')
const isDev = require('electron-is-dev')
const path = require('path')
const { internalEmitter } = require('electron-window-manager')
const { CANCEL_SUBSCRIPTION } = require('../lib/constants/stateManagement')
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

app.setName(application.APP_NAME)
app.on('ready', () => {
  debug('App initialzed')
  windowManager.init()
  analytics.trackAppOpen()

  //Creates tray menu
  require('./tray').buildTray()
  debug('Creating menu')
  require('./menu').createMenu()
  debug('Loading Dependencies')
  require('../kernel/lib/actionCreators')

  if (process.platform == 'win32') { deepLinkingUrl = process.argv.slice(1) }
  deepLinkingUrl && windowManager.openDeepLinking(deepLinkingUrl)

  if (isDev) {
    //Hot reloads browser side changes
    require('electron-reload')(path.resolve('browser'))
    //Registers command/control + \ to open dev tools
    globalShortcut.register('CommandOrControl+\\', () => {
      try { windowManager.getCurrent().object.openDevTools() } catch (e) { }
    })
    globalShortcut.register('CommandOrControl+r', () => {
      try { windowManager.getCurrent().object.reload() } catch (e) { }
    })
  }

  if (process.argv.includes('loggedin') === false) {
    windowManager.openWindow('login')
  }
})
//Prevents app from closing when all windows are shut
app.on('window-all-closed', () => { })

// For Deep Linking
app.setAsDefaultProtocolClient('ara')
app.on('open-url', (event, url) => {
  event.preventDefault()
  deepLinkingUrl = url
  app.isReady() && windowManager.openDeepLinking(url)
})

app.on('before-quit', () => {
  const { farmerManager } = require('../kernel/lib/actions')
  const { farmer: { farm } } = require('../kernel/lib/store')
  internalEmitter.emit(CANCEL_SUBSCRIPTION)
  farmerManager.stopAllBroadcast(farm)
})

process.on('uncaughtException', err => debug('uncaught exception: %o', err))
process.on('unhandledRejection', err => debug('unhandled rejection: %o', err))