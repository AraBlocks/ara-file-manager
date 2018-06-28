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
    {label: 'Publish File', type: 'normal'},
    {label: 'Log Out', type: 'normal'},
    {label: 'Quit', type: 'normal', role: 'quit'}
  ])
  tray.setToolTip('Ara Content Manager')
  tray.setContextMenu(contextMenu)
  return tray

  function openFileManager() {
    openWindow('fileManager.js')
  }

  function openWindow(name) {
    let shouldMoveWindow = (windowManager.get(name).object === undefined) ? true : false 
    windowManager.bridge.emit(name)
    windowManager.sharedData.set('current', name.slice(0, name.length - 3))
    let window = windowManager.get(name).object
    window.show()
    if (shouldMoveWindow) { adjustPosition(window) } 
  }

  function adjustPosition(window) {
    let positioner = new Positioner(window)
    let bounds = tray.getBounds(window)
    const position = positioner.calculate('topRight')
    window.setPosition(position.x, position.y)
  }
}


