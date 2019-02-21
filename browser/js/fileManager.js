const { stateManagement: k } = require('k')
const { ipcRenderer, remote } = require('electron')
const windowManager = remote.require('electron-window-manager')
const store = windowManager.sharedData.fetch('store')

const FileManager = require('../views/fileManager/container')
const fileManager = new FileManager(store)
document.getElementById('container').appendChild(fileManager.render(store))

const refreshListener = ipcRenderer.on(k.REFRESH, () => fileManager.render(store))
window.onunload = () => ipcRenderer.removeListener(k.REFRESH, refreshListener)