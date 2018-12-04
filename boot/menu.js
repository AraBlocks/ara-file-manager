const { Menu, app } = require('electron')
const windowManager = require('electron-window-manager')
const { internalEmitter } = require('electron-window-manager')
const k = require('../lib/constants/stateManagement')

let contextMenu
function createMenu() {
  application = {
    label: "Application",
    submenu: [
      {
        label: "About",
        selector: "orderFrontStandardAboutPanel:"
      },
      {
        type: "separator"
      },
      {
        label: 'File Manager',
        click: () => {
          windowManager.openWindow('filemanager')
        }
      },
      {
        label: 'Publish File',
        click: () => {
          internalEmitter.emit(k.DEPLOY_PROXY)
        }
      },
      {
        label: 'Account',
        click: () => {
          windowManager.openWindow('accountInfo')
        }
      },
      {
        label: 'Register',
        click: () => {
          windowManager.openWindow('registration')
        }
      },
      {
        label: 'Login',
        click: () => {
          windowManager.openWindow('login')
        }
      },
      {
        label: 'Log Out',
        click: () => {
          internalEmitter.emit(k.LOGOUT)
        }
      },
      {
        type: "separator"
      },
      {
        label: "Quit",
        accelerator: "Command+Q",
        click: () => {
          app.quit()
        }
      }
    ]
  }

  const edit = {
    label: "Edit",
    submenu: [
      {
        label: "Undo",
        accelerator: "CmdOrCtrl+Z",
        selector: "undo:"
      },
      {
        label: "Redo",
        accelerator: "Shift+CmdOrCtrl+Z",
        selector: "redo:"
      },
      {
        type: "separator"
      },
      {
        label: "Cut",
        accelerator: "CmdOrCtrl+X",
        selector: "cut:"
      },
      {
        label: "Copy",
        accelerator: "CmdOrCtrl+C",
        selector: "copy:"
      },
      {
        label: "Paste",
        accelerator: "CmdOrCtrl+V",
        selector: "paste:"
      },
      {
        label: "Select All",
        accelerator: "CmdOrCtrl+A",
        selector: "selectAll:"
      }
    ]
  }

  const window = {
    label: 'Window',
    submenu: [
      {
        label: 'Close Window',
        accelerator: "CmdOrCtrl+Shift+W",
        role: 'close'
      },
      {
        label: 'Minimize',
        accelerator: "CmdOrCtrl+M",
        role: 'minimize'
      }
    ]
  }

  const template = [
    application,
    edit,
    window
  ]
  contextMenu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(contextMenu)
  switchApplicationMenuLoginState(false)
}

function switchApplicationMenuLoginState(loggedIn) {
  const applicationMenu = contextMenu.items[0].submenu.items
  applicationMenu[2].visible = loggedIn //FileManager
  applicationMenu[3].visible = loggedIn //PublishFile
  applicationMenu[4].visible = loggedIn //Account Info
  applicationMenu[5].visible = !loggedIn //Register
  applicationMenu[6].visible = !loggedIn //Login
  applicationMenu[7].visible = loggedIn //Log out
}

module.exports = { createMenu, switchApplicationMenuLoginState }