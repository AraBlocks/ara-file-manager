'use strict'

const debug = require('debug')('afm:boot:tray')
const isDev = require('electron-is-dev')
const { Menu, Tray } = require('electron')
const path = require('path')
const { openWindow, closeWindow } = require('electron-window-manager')
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
    {
      label: 'Register',
      type: 'normal',
      click: () => {
        openWindow('registration')
        closeWindow('login')
      }
    },
    {
      label: 'Login',
      type: 'normal',
      click: () => {
        openWindow('login')
        closeWindow('registration')
      }
    },
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

function switchLoginState(state) {
  const menuItems = contextMenu.items
  const loggedIn = state === k.LOGIN
  const loading = state === k.LOADING_LIBRARY
  menuItems[0].visible = loggedIn //FileManager
  menuItems[1].visible = loggedIn //Publish File View
  menuItems[2].visible = loggedIn //Account Info
  menuItems[3].visible = !loggedIn && !loading //Register
  menuItems[4].visible = !loggedIn && !loading //Login
  menuItems[5].visible = loggedIn  //Log out
}

function switchPendingPublishState(pending) {
  contextMenu.items[1].enabled = !pending //Publish File View
}

module.exports = {
  buildTray,
  switchLoginState,
  switchPendingPublishState
}