const { app, Menu } = require('electron')
const { events } = require('k')
const windowManager = require('electron-window-manager')

const { internalEmitter } = windowManager

let contextMenu
function buildMenu() {
  const application = {
    label: "Application",
    submenu: [
      { label: "About", selector: "orderFrontStandardAboutPanel:" },
      { type: 'separator' },
      { label: 'File Manager', click: () => windowManager.openWindow('filemanager') },
      { label: 'Publish File', click: () => internalEmitter.emit(events.OPEN_MANAGE_FILE_VIEW) },
      { label: 'Account', click: () => windowManager.openWindow('accountInfo') },
      {
        label: 'Register',
        click: () => {
          internalEmitter.emit(events.CREATE_USER_DID)
          windowManager.openWindow('registration')
          windowManager.closeWindow('login')
        }
      },
      {
        label: 'Login',
        click: () => {
          windowManager.openWindow('login')
          windowManager.closeWindow('registration')
        }
      },
      { label: 'Log Out', click: () => internalEmitter.emit(events.LOGOUT) },
      { type: "separator" },
      { label: "Quit",
        accelerator: "Command+Q",
        click: () => app.quit()
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
  switchMenuLoginState(false)
}

function switchMenuLoginState(state) {
  const applicationMenu = contextMenu.items[0].submenu.items
  const loggedIn = state === events.LOGIN
  const loading = state === events.LOADING_LIBRARY

  applicationMenu[2].visible = loggedIn //FileManager
  applicationMenu[3].visible = loggedIn //PublishFile
  applicationMenu[4].visible = loggedIn //Account Info
  applicationMenu[5].visible = !loggedIn && !loading //Register
  applicationMenu[6].visible = !loggedIn && !loading //Login
  applicationMenu[7].visible = loggedIn //Log out
}

function switchMenuPublishState(pending) {
  const applicationMenu = contextMenu.items[0].submenu.items
  applicationMenu[3].enabled = !pending //Publish File View
  applicationMenu[7].enabled = !pending //Log out
  applicationMenu[9].enabled = !pending //Quit
}

module.exports = {
  buildMenu,
  switchMenuLoginState,
  switchMenuPublishState
}
