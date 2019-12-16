const debug = require('debug')('ara:fm:boot:tray')

const isDev = require('electron-is-dev')
const { closeWindow, internalEmitter, openWindow } = require('electron-window-manager')
const { events } = require('k')
const { Menu, Tray } = require('electron')
const path = require('path')

let tray
let contextMenu
const buildTray = () => {
  debug('Building tray')
  const icon = process.platform === 'darwin' ? 'mac-tray-icon-Template.png' : 'windows-tray-icon.png'
  const iconPath = path.resolve(__dirname, '..', 'browser', 'assets', 'images', icon)
  tray = new Tray(iconPath)
  tray.setToolTip('Ara File Manager')

  const menuItems = [
    { label: 'File Manager', type: 'normal', visible: false, click: () => openWindow('filemanager') },
    { label: 'Publish File', type: 'normal', visible: false, click: () => internalEmitter.emit(events.OPEN_MANAGE_FILE_VIEW) },
    { label: 'Account', type: 'normal', visible: false, click: () => openWindow('accountInfo') },
    {
      label: 'Register',
      type: 'normal',
      click: () => {
        internalEmitter.emit(events.CREATE_USER_DID)
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
    { label: 'Log Out', type: 'normal', visible: false, click: () => internalEmitter.emit(events.LOGOUT) }
  ]

  //If dev mode, pushes developer option to tray
  isDev
    && menuItems.push({ label: 'Developer', type: 'normal', click: () => openWindow('developer') })
    && menuItems.push({ label: 'Clean UI', type: 'normal', click: () => internalEmitter.emit(events.CLEAN_UI) })

  const quitOrExit = process.platform === 'darwin' ? "Quit [TODO]" : "Exit [TODO]"
  menuItems.push({ label: quitOrExit, type: 'normal', click: () => internalEmitter.emit(events.CONFIRM_QUIT) })

  //Creates context menu and adds onclick listener to tray
  contextMenu = Menu.buildFromTemplate(menuItems)

  if (process.platform === 'darwin') {//Mac
    tray.on('click', () => tray.popUpContextMenu(contextMenu))
  } else {//Windows and Linux
    tray.on('click', () => openWindow('filemanager'))//TODO app.on('activate') should be all we need, though
    tray.on('right-click', () => tray.popUpContextMenu(contextMenu))
  }

  isDev && openWindow('developer')
}

function switchTrayLoginState(state) {
  const menuItems = contextMenu.items
  const loggedIn = state === events.LOGIN
  const loading = state === events.LOADING_LIBRARY
  menuItems[0].visible = loggedIn //FileManager
  menuItems[1].visible = loggedIn //Publish File View
  menuItems[2].visible = loading || loggedIn //Account Info
  menuItems[3].visible = !loggedIn && !loading //Register
  menuItems[4].visible = !loggedIn && !loading //Login
  menuItems[5].visible = loggedIn  //Log out
}

function switchTrayPublishState(pending) {
  contextMenu.items[1].enabled = !pending //Publish File View
  contextMenu.items[5].enabled = !pending //Logout
  contextMenu.items[6].enabled = !pending //Quit
}

module.exports = {
  buildTray,
  switchTrayLoginState,
  switchTrayPublishState
}