'use strict'

const { Menu, Tray } = require('electron')
const path = require('path')
const Positioner = require('electron-positioner')
const windowManager = require('electron-window-manager')

const iconPath = path.resolve(__dirname, '..', 'browser', 'assets', 'images', 'IconTemplate.png')
const devIndex = `file://${path.resolve(__dirname, '..', 'browser/index-dev.html')}`
const managerIndex = `file://${path.resolve(__dirname, '..', 'browser/index.html')}`

let tray
const buildTray = () => {
  tray = new Tray(iconPath)
  tray.setToolTip('Ara Content Manager')

  const contextMenu = Menu.buildFromTemplate([
    { label: 'File Manager', type: 'normal', click: () => openWindow('manager') },
    { label: 'Publish File', type: 'normal' },
    { label: 'Log Out', type: 'normal' },
    { label: 'Developer', type: 'normal' , click: () => openWindow('developer') },
    { label: 'Quit', type: 'normal', role: 'quit' }
  ])
  tray.setContextMenu(contextMenu)

  function openWindow(view) {
    const window = windowManager.get(view) || createWindow(view)
    const shouldMoveWindow = window.object === null
    window.open()
    window.object.show()
    if (shouldMoveWindow) { adjustPosition(window.object) }
  }

  function createWindow(view) {
    return windowManager.createNew(view, view, getIndex(view), {
      width: 300,
      height: 300,
      showDevTools: false
     })
  }

  function adjustPosition(window) {
    const positioner = new Positioner(window)
    const position = positioner.calculate('topRight')
    window.setPosition(position.x, position.y)
  }

  function getIndex(view){
    let index
    switch (view){
      case 'manager':
        index = managerIndex
        break
      default:
        index = devIndex
    }
    return index
  }

  openWindow('developer')
}


module.exports = buildTray