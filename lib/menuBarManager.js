const electron = require('electron')
const { app, Menu, Tray } = require('electron')
const windowManager = require('electron-window-manager')
const path = require('path')
const Positioner = require('electron-positioner')
const iconPath = path.join(__dirname, '..', 'IconTemplate.png')

module.exports = function create() {
  let tray = new Tray(iconPath)
  const contextMenu = Menu.buildFromTemplate([
    {label: 'File Manager', type: 'normal', click: openFileManager},
    {label: 'Publish File', type: 'normal', click: openPublishFile},
    {label: 'Log Out', type: 'normal'},
    {label: 'Quit', type: 'normal', role: 'quit'}
  ])
  tray.on('click', openFileManager)
  tray.on('double-click', openFileManager)
  tray.setToolTip('Ara Content Manager')
  tray.setContextMenu(contextMenu)
  return 

  function openPublishFile() {
    let view = "testComponent.js"
    windowManager.bridge.emit(view)
    windowManager.sharedData.set('current', view.slice(0, view.length - 3))
    windowManager.get(view).object.show()
  }

  function openFileManager() {
    if (windowManager.get('home').object.isVisible()) {
      windowManager.get('home').object.hide()
    } else {
      windowManager.get('home').object.show()
    }
  }
}


