'use strict'

const { Menu, Tray } = require('electron')
const path = require('path')
const windowManager = require('electron-window-manager')

const iconPath = path.resolve(__dirname, '..', 'browser', 'assets', 'images', 'IconTemplate.png')

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
    if (shouldMoveWindow) { adjustPosition(window) }
  }

  function createWindow(view) {
    return windowManager.createNew(
      view,
      view,
      windowManager.loadURL(view),
      false,
      {
        ...windowManager.setSize(view),
        resizable: true
      }
    )
  }

  function adjustPosition({ name, object: window }) {
    const { x, y } = tray.getBounds()
    const offset = windowManager.setSize(name).width / 2
    const iconWidth = 7
    window.setPosition(x - offset + iconWidth, y)
  }

  openWindow('developer')
}


module.exports = buildTray