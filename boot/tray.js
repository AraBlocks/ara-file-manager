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
let contextMenu
const buildTray = () => {
  debug('Building tray')
  tray = new Tray(iconPath)
  tray.setToolTip('Ara Content Manager')

  const menuItems = [
    { label: 'File Manager', type: 'normal', visible: false, click: () => openWindow('filemanager') },
    { label: 'Publish File', type: 'normal', visible: false, click: () => openWindow('publishFileView') },
    { label: 'Account', type: 'normal', visible: false, click: () => openWindow('accountInfo') },
    { label: 'Register', type: 'normal', click: () => openWindow('registration') },
    { label: 'Login', type: 'normal', click: () => openWindow('login') },
    { label: 'Log Out', type: 'normal', visible: false, click: () => internalEmitter.emit(LOGOUT, null) },
    { label: 'Quit', type: 'normal', role: 'quit' }
  ]

  //If dev mode, pushes developer option to tray
  isDev && menuItems.push({ label: 'Developer', type: 'normal', click: () => openWindow('developer')})

  //Creates context menu and adds onclick listener to tray
  contextMenu = Menu.buildFromTemplate(menuItems)
  tray.on('click', () => tray.popUpContextMenu(contextMenu))

  function openWindow(view) {
    const window = windowManager.get(view) || createWindow(view)
    window.open()
    window.object.show()
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
        ...windowManager.setSize(view)
      }
    )
  }

  isDev && openWindow('developer')
}

function switchLoginState(loggedIn) {
  if (isDev) {
    contextMenu.commandsMap['46'].visible = loggedIn //FileManager
    contextMenu.commandsMap['47'].visible = loggedIn //Publish File View
    contextMenu.commandsMap['48'].visible = loggedIn //Account Info
    contextMenu.commandsMap['49'].visible = !loggedIn //Register
    contextMenu.commandsMap['50'].visible = !loggedIn //Login
    contextMenu.commandsMap['51'].visible = loggedIn  //Log out
  } else {
    contextMenu.commandsMap['1'].visible = loggedIn //FileManager
    contextMenu.commandsMap['2'].visible = loggedIn //Publish File View
    contextMenu.commandsMap['3'].visible = loggedIn //Account Info
    contextMenu.commandsMap['4'].visible = !loggedIn //Register
    contextMenu.commandsMap['5'].visible = !loggedIn //Login
    contextMenu.commandsMap['6'].visible = loggedIn  //Log out
  }
}

function switchPendingTransactionState(pending) {
  isDev
    ? contextMenu.commandsMap['47'].enabled = !pending //Publish File View Dev
    : contextMenu.commandsMap['2'].enabled = !pending //Publish File View Build
}

module.exports = {
  buildTray,
  switchLoginState,
  switchPendingTransactionState
}