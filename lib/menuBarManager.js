const { Menu, Tray } = require('electron')
const windowManager = require('electron-window-manager')
const path = require('path')
const Positioner = require('electron-positioner')
const iconPath = path.join(__dirname, '..', 'IconTemplate.png')

module.exports = function() {
  const tray = new Tray(iconPath)
  const contextMenu = Menu.buildFromTemplate([
    { label: 'File Manager', type: 'normal', click: () => openWindow('fileManager.js') },
    { label: 'Publish File', type: 'normal' },
    { label: 'Log Out', type: 'normal' },
    { label: 'Quit', type: 'normal', role: 'quit' }
  ])

  tray.on('click', () => openWindow('fileManager.js'))
  tray.setToolTip('Ara Content Manager')
  tray.setContextMenu(contextMenu)

  function openWindow(name) {
    const shouldMoveWindow = (windowManager.get(name).object === undefined) ? true : false 
    windowManager.bridge.emit(name)
    windowManager.sharedData.set('current', name.slice(0, name.length - 3))
    const window = windowManager.get(name).object
    window.show()
    if (shouldMoveWindow) { adjustPosition(window) } 
  }

  function adjustPosition(window) {
    const positioner = new Positioner(window)
    const position = positioner.calculate('topRight')
    window.setPosition(position.x, position.y)
  }
}


