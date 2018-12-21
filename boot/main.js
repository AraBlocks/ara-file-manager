'use strict'

const debug = require('debug')('acm:boot:main')
const writeFiles = require('./writeFiles')
//Writes .ara and keyrings if doesn't exist
if (writeFiles.updateAraRC() === false) { debug('.ararc exists, not writing file') }
if (writeFiles.writeDotAra() === false) { debug('.ara exists, not writing directory') }

const { cleanOutdatedData } = require('../kernel/redux/actions/afmManager')
const { app, globalShortcut } = require('electron')
const windowManager = require('../kernel/lib/lsWindowManager')
const { application } = require('../lib/constants/index')
const analytics = require('../kernel/redux/actions/analytics')
const isDev = require('electron-is-dev')
const path = require('path')
const { internalEmitter } = require('electron-window-manager')
const { CANCEL_SUBSCRIPTION, GET_CACHED_DID } = require('../lib/constants/stateManagement')
//Creates dev view
isDev && require('./ipc-dev')
let deepLinkingUrl
cleanOutdatedData() //!!! Very Dangerous code !!!

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

  //Creates tray menu
  require('./tray').buildTray()
  debug('Creating menu')
  require('./menu').createMenu()
  debug('Loading Dependencies')
  require('../kernel/redux/actionCreators')

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
  internalEmitter.emit(GET_CACHED_DID)
  analytics.trackAppOpen()

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
  const { farmerManager } = require('../kernel/redux/actions')
  const { farmer: { farm } } = require('../kernel/redux/store')
  internalEmitter.emit(CANCEL_SUBSCRIPTION)
  farmerManager.stopAllBroadcast(farm)
})

process.on('uncaughtException', async err => {
  await analytics.trackError(err.stack)
  debug('uncaught exception: %o', err)
})
process.on('unhandledRejection', async err => {
  await analytics.trackError(err.stack)
  debug('unhandled rejection: %o', err)
})
