const { Menu, app } = require('electron')

let contextMenu
function createMenu() {
  const application = {
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

        }
      }, 
      {
        label: 'Publish File',
        click: () => {

        }
      },
      {
        label: 'Account',
        click: () => {

        }
      },
      {
        label: 'Register',
        click: () => {

        }
      },
      {
        label: 'Login',
        click: () => {

        }
      },
      {
        label: 'Log Out',
        click: () => {

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
}

module.exports = createMenu