'use strict'

const AFSExlorer = require('../views/afsExplorerView/container')
const { ipcRenderer, remote } = require('electron')
const { REFRESH } = require('../../lib/constants/stateManagement')
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
document.getElementById('container').appendChild(afsExplorer.render({ spinner: modal.contentViewerData.fileList.length === 0 }))

const refreshListener = ipcRenderer.on(REFRESH, () => afsExplorer.render({ spinner: false, fileList: modal.contentViewerData.fileList }))
window.onunload = () => {
	ipcRenderer.removeListener(REFRESH, refreshListener)
}

if (isDev) { window.store = store }
