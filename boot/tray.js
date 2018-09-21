'use strict'

const debug = require('debug')('acm:boot:tray')
const isDev = require('electron-is-dev')
const { Menu, Tray, screen } = require('electron')
const path = require('path')
const windowManager = require('electron-window-manager')
const iconPath = path.resolve(__dirname, '..', 'browser', 'assets', 'images', 'IconTemplate.png')
const { internalEmitter } = require('electron-window-manager')
const { LOGOUT } = require('../lib/constants/stateManagement')

let tray
const buildTray = () => {
  debug('Building tray')
  tray = new Tray(iconPath)
  tray.setToolTip('Ara Content Manager')

  const menuItems = [
    { label: 'Register', type: 'normal', click: () => openWindow('registration') },
    { label: 'Login', type: 'normal', click: () => openWindow('login') },
    { label: 'File Manager', type: 'normal', click: () => openWindow('filemanager') },
    { label: 'Publish File', type: 'normal', click: () => openWindow('publishFileView') },
    { label: 'Log Out', type: 'normal', click: () => internalEmitter.emit(LOGOUT, null) },
    { label: 'Quit', type: 'normal', role: 'quit' }
  ]

  //If dev mode, pushes developer option to tray
  isDev && menuItems.push({ label: 'Developer', type: 'normal', click: () => openWindow('developer')})

  //Creates context menu and adds onclick listener to tray
  const contextMenu = Menu.buildFromTemplate(menuItems)
  tray.on('click', () => tray.popUpContextMenu(contextMenu))

  function openWindow(view) {
    const window = windowManager.get(view) || createWindow(view)
    // const shouldMoveWindow = window.object === null
    window.open()
    window.object.show()
    // if (shouldMoveWindow && view === 'manager') { adjustPosition(window) }
  }

  function createWindow(view) {
    return windowManager.createNew(
      view,
      view,
      windowManager.loadURL(view),
      false,
      {
        backgroundColor: 'white',
        frame: false,
        resizable: true,
        ...windowManager.setSize(view)
      }
    )
  }

  // function adjustPosition({ name, object: window }) {
  //   const screenSize = screen.getPrimaryDisplay().bounds
  //   const offset = windowManager.setSize(name).width
  //   window.setPosition(screenSize.width - offset, 0)
  // }

  isDev && openWindow('developer')
}


module.exports = buildTray