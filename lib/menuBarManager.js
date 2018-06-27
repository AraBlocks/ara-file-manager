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
  tray.on('click', openPublishFile)
  tray.on('double-click', openPublishFile)
  tray.setToolTip('Ara Content Manager')
  //tray.setContextMenu(contextMenu)
  return tray

  function openPublishFile() {
    let view = "modalButton.js"
    windowManager.bridge.emit(view)
    windowManager.sharedData.set('current', view.slice(0, view.length - 3))

    let window = windowManager.get(view).object 
    window.show()
    adjustPosition(window)
  }

  function openFileManager() {
    let window = windowManager.get('home').object 
    if (window.isVisible()) {
      window.hide()
    } else {
      window.show()
      adjustPosition(window)
    }
  }

  function adjustPosition(window) {
    let positioner = new Positioner(window)
    let bounds = tray.getBounds(window)
    const position = positioner.calculate('trayCenter', bounds)
    window.setPosition(position.x, position.y)
  }
}


