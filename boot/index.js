const debug = require('debug')('ara:fm:boot:main')
//if (require('electron-squirrel-startup')) return //TODO replace with new system @zootella
const writeFiles = require('./writeFiles')
//Writes .ara and keyrings if doesn't exist

writeFiles.updateAraRC()
writeFiles.writeDotAra()

const { app } = require('electron')
const { application, events } = require('k')
const windowManager = require('../kernel/lib/lsWindowManager')
const { internalEmitter, openDeepLinking } = require('electron-window-manager')
const analytics = require('../kernel/daemons/analytics')
const cleanUp = require('./cleanUp')
const { handleDeepLink, deeplinkWaiting } = require('./deepLink')


require('./preventMultInstances')//Prevent windows from making multiple instances of app

app.setName(application.APP_NAME)

app.on('second-instance', (event, argv, workingDirectory) => {
  if (process.platform === 'win32') {
    const arg = argv[1]
    if (arg && arg.includes('ara://')) { openDeepLinking(arg) }
  }
})

app.on('ready', () => {
  debug('App initialzed')
  windowManager.init()

  require('./tray').buildTray()
  require('./menu').buildMenu()
  require('../kernel/ipc')//TODO: create proper store creation function
//  require('./squirrel') //TODO replace with new system @zootella
  require('./applyDevSettings')

  internalEmitter.emit(events.GET_CACHED_DID)//Loads login screen input with last DID user logged in with
  analytics.trackAppOpen()

  //Opens login view if app not started with loggedin mode on and app not opened with deeplink
  if (process.argv.includes('loggedin') === false && deeplinkWaiting() === false) {
    windowManager.openWindow('login')
  }
})

//Prevents app from closing when all windows are closed
app.on('window-all-closed', () => { })

// The user clicked our icon on the dock after closing the window, open it again
app.on('activate', () => windowManager.openWindow('filemanager'))

// For Deep Linking
app.setAsDefaultProtocolClient('ara')
app.on('open-url', handleDeepLink)

app.on('before-quit', cleanUp)

process.on('uncaughtException', async err => {
  await analytics.trackError(err.stack)
  debug('uncaught exception: %o', err)
})

process.on('unhandledRejection', async err => {
  await analytics.trackError(err.stack)
  debug('unhandled rejection: %o', err)
})
