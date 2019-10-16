const AFSExlorer = require('../views/afsExplorerView/container')
const { ipcRenderer, remote } = require('electron')
const { events } = require('k')
const windowManager = remote.require('electron-window-manager')
const store = windowManager.sharedData.fetch('store')
const isDev = require('electron-is-dev')

const { modal } = store
const afsExplorer = new AFSExlorer({
  afsName: modal.contentViewerData.name,
  did: modal.contentViewerData.did,
  fileList: modal.contentViewerData.fileList,
  updateAvailable: modal.contentViewerData.updateAvailable
})
const customTitlebar = require('custom-electron-titlebar')
new customTitlebar.Titlebar({
    backgroundColor: customTitlebar.Color.WHITE,
    shadow: false,
    menu: null,
    titleHorizontalAlignment: process.platform === 'win32' ? 'left' : 'center',
    maximizable: false,
}).updateTitle(' ')
document.getElementById('container').appendChild(afsExplorer.render({ spinner: modal.contentViewerData.fileList.length === 0 }))

const refreshListener = ipcRenderer.on(events.REFRESH, () => afsExplorer.render({ spinner: false, fileList: modal.contentViewerData.fileList }))
window.onunload = () => {
	ipcRenderer.removeListener(events.REFRESH, refreshListener)
}

if (isDev) { window.store = store }
