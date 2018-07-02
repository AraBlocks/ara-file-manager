const { Menu, Tray } = require('electron')
const windowManager = require('electron-window-manager')
const path = require('path')
const Positioner = require('electron-positioner')
const iconPath = path.join(__dirname, '..', 'browser', 'assets', 'images', 'IconTemplate.png')

const index = `file://${path.resolve(__dirname, '..', 'browser/index.html')}`
module.exports = () => {
  const tray = new Tray(iconPath)
  const contextMenu = Menu.buildFromTemplate([
    { label: 'File Manager', type: 'normal', click: () => openWindow('fileManager') },
    { label: 'Publish File', type: 'normal' },
    { label: 'Log Out', type: 'normal' },
    { label: 'Quit', type: 'normal', role: 'quit' }
  ])

  windowManager.createNew('fileManager', 'File Manager', index, false, { showDevTools: false })

  tray.setToolTip('Ara Content Manager')
  tray.setContextMenu(contextMenu)

  function openWindow(windowName) {
    const window = windowManager.get(windowName)
    window.open()
    if (shouldMoveWindow) { adjustPosition(window) }
  }

  function adjustPosition(window) {
    const positioner = new Positioner(window)
    const position = positioner.calculate('topRight')
    window.setPosition(position.x, position.y)
  }
}


