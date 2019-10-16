const { events } = require('k')
const { ipcRenderer, remote } = require('electron')
const windowManager = remote.require('electron-window-manager')
const store = windowManager.sharedData.fetch('store')

const FileManager = require('../views/fileManager/container')
const fileManager = new FileManager(store)
const customTitlebar = require('custom-electron-titlebar')
new customTitlebar.Titlebar({
    backgroundColor: customTitlebar.Color.fromHex('#1c1c1c'),
    shadow: false,
    menu: null,
    titleHorizontalAlignment: 'center',
    maximizable: false
})
document.getElementById('container').appendChild(fileManager.render(store))

const refreshListener = ipcRenderer.on(events.REFRESH, () => fileManager.render(store))
window.onunload = () => ipcRenderer.removeListener(events.REFRESH, refreshListener)
