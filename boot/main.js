'use strict'

const { app, globalShortcut } = require('electron')
const windowManager = require('../kernel/lib/lsWindowManager')
const isDev = require('electron-is-dev')
const path = require('path')
if (isDev) { require('./ipc-dev') }

let deeplinkingUrl

const shouldQuit = app.makeSingleInstance((argv, workingDirectory) => {
  if (process.platform == 'win32') {
    deeplinkingUrl = argv.slice(1)
  }
})
if (shouldQuit) {
    app.quit()
    return
}

app.on('ready', () => {
  windowManager.init()
  require('../kernel/lib/actionCreators')
  if (isDev) { require('electron-reload')(path.resolve('browser')) }
  require('./tray')()
  require('./server')()
  require('../demoServer/demoServer')
  globalShortcut.register('CommandOrControl+/', () => {
    windowManager.getCurrent().object.openDevTools()
  })
  if (process.platform == 'win32') {
    deeplinkingUrl = process.argv.slice(1)
  }
  if (deeplinkingUrl) {
    openDeepLinking()
  }
})
app.on('window-all-closed', () => {})

// For Deek Linking
app.setAsDefaultProtocolClient('lstr')
app.on('open-url', function (event, url) {
  event.preventDefault()
  deeplinkingUrl = url
  if (app.isReady()) {
    openDeepLinking()
  }
})

function openDeepLinking() {
  const modalName = 'reDownloadModal'
  if (windowManager.get(modalName).object != null) { return }
  windowManager.sharedData.set('current', modalName)
  windowManager.createNew(
    modalName,
    modalName,
    windowManager.loadURL(modalName),
    false,
    {
      backgroundColor: 'white',
      frame: false,
      ...windowManager.setSize(modalName),
    }
  ).open()
  parseLink()
}

function parseLink() {
  const linkElements = deeplinkingUrl.slice(7).split("/")
  if (linkElements.length === 3 && linkElements[0] == 'download') {
    windowManager.fileInfo = {
      aid: linkElements[1],
      fileName: linkElements[2],
      price: 44
    }
  }
}