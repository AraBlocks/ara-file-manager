'use strict'

const debug = require('debug')('acm:boot:tray')
const isDev = require('electron-is-dev')
const { Menu, Tray } = require('electron')
const path = require('path')
const { openWindow } = require('electron-window-manager')
const iconPath = path.resolve(__dirname, '..', 'browser', 'assets', 'images', 'IconTemplate.png')
const { internalEmitter } = require('electron-window-manager')
const k = require('../lib/constants/stateManagement')

let tray
let contextMenu
const buildTray = () => {
  debug('Building tray')
  tray = new Tray(iconPath)
  tray.setToolTip('Ara File Manager')

  const menuItems = [
    { label: 'File Manager', type: 'normal', visible: false, click: () => openWindow('filemanager') },
    { label: 'Publish File', type: 'normal', visible: false, click: () => internalEmitter.emit(k.DEPLOY_PROXY) },
    { label: 'Account', type: 'normal', visible: false, click: () => openWindow('accountInfo') },
    { label: 'Register', type: 'normal', click: () => openWindow('registration') },
    { label: 'Login', type: 'normal', click: () => openWindow('login') },
    { label: 'Log Out', type: 'normal', visible: false, click: () => internalEmitter.emit(k.LOGOUT) },
    { label: 'Quit', type: 'normal', click: () => internalEmitter.emit(k.CONFIRM_QUIT)}
  ]

  //If dev mode, pushes developer option to tray
  isDev
  && menuItems.push({ label: 'Developer', type: 'normal', click: () => openWindow('developer')})
  && menuItems.push({ label: 'Clean UI', type: 'normal', click:() => internalEmitter.emit(k.CLEAN_UI)})

  //Creates context menu and adds onclick listener to tray
  contextMenu = Menu.buildFromTemplate(menuItems)
  tray.on('click', () => tray.popUpContextMenu(contextMenu))
  isDev && openWindow('developer')
}

function switchLoginState(loggedIn) {
  const menuItems = contextMenu.items
  menuItems[0].visible = loggedIn //FileManager
  menuItems[1].visible = loggedIn //Publish File View
  menuItems[2].visible = loggedIn //Account Info
  menuItems[3].visible = !loggedIn //Register
  menuItems[4].visible = !loggedIn //Login
  menuItems[5].visible = loggedIn  //Log out
}

function switchPendingTransactionState(pending) {
  contextMenu.items[1].enabled = !pending //Publish File View
}

module.exports = {
  buildTray,
  switchLoginState,
  switchPendingTransactionState
}