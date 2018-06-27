'use strict'

const electron = require('electron')
const { app, Menu, Tray } = require('electron')
const windowManager = require('electron-window-manager')
const isDev = require('electron-is-dev')
const path = require('path')
const Positioner = require('electron-positioner')
require('./ipc-dev')

const index = `file://${path.resolve(__dirname, '..', 'browser/index.html')}`
const popUp =  `file://${path.resolve(__dirname, '..', 'browser/views/testComponent.js')}`
const iconPath = path.join(__dirname, '..', 'IconTemplate.png')
let tray = null
let cachedBounds

app.on('ready', () => {
  windowManager.init()
  windowManager.open('home', 'Welcome', index, false, { showDevTools: true })
  if (isDev) { require('electron-reload')(path.resolve('browser')) }
  tray = new Tray(iconPath)
  const contextMenu = Menu.buildFromTemplate([
    {label: 'File Manager', type: 'normal', click: clicked},
    {label: 'Publish File', type: 'normal', click: open},
    {label: 'Log Out', type: 'normal'},
    {label: 'Quit', type: 'normal', role: 'quit'}
  ])
  tray.on('click', clicked)
  tray.on('double-click', clicked)
  tray.setToolTip('Ara Content Manager')
  tray.setContextMenu(contextMenu)
})

function open() {
  let view = "testComponent.js"
  windowManager.bridge.emit(view)
  windowManager.sharedData.set('current', view.slice(0, view.length - 3))
  windowManager.get(view).object.show()
}

function clicked() {
  if (windowManager.get('home').object.isVisible()) {
    windowManager.get('home').object.hide()
  } else {
    windowManager.get('home').object.show()
  }
}