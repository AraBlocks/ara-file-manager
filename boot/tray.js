'use strict'

const { Menu, Tray, screen } = require('electron')
const path = require('path')
const windowManager = require('electron-window-manager')

const iconPath = path.resolve(__dirname, '..', 'browser', 'assets', 'images', 'IconTemplate.png')

let tray
const buildTray = () => {
  tray = new Tray(iconPath)
  tray.setToolTip('Ara Content Manager')

  const contextMenu = Menu.buildFromTemplate([
    { label: 'File Manager', type: 'normal', click: () => openWindow('fManagerView') },
    { label: 'Publish File', type: 'normal', click: () => openWindow('publishFileView') },
    { label: 'Log Out', type: 'normal' },
    { label: 'Developer', type: 'normal' , click: () => openWindow('developer') },
    { label: 'Quit', type: 'normal', role: 'quit' }
  ])

  tray.on('click', () => {
    openWindow('manager')
    tray.popUpContextMenu(contextMenu)
  })

  function openWindow(view) {
    const window = windowManager.get(view) || createWindow(view)
    const shouldMoveWindow = window.object === null
    window.open()
    window.object.show()
    if (shouldMoveWindow && view === 'manager') { adjustPosition(window) }
  }

  function createWindow(view) {
    return windowManager.createNew(
      view,
      view,
      windowManager.loadURL(view),
      false,
      {
        frame: false,
        resizable: true,
        ...windowManager.setSize(view)
      }
    )
  }

  function adjustPosition({ name, object: window }) {
    const screenSize = screen.getPrimaryDisplay().bounds
    const offset = windowManager.setSize(name).width
    window.setPosition(screenSize.width - offset, 0)
  }

  openWindow('developer')
}


module.exports = buildTray