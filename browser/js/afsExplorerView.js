'use strict'
const AFSExlorer = require('../views/afsExplorerView/container')
const { ipcRenderer, remote } = require('electron')
const { REFRESH } = require('../../lib/constants/stateManagement')
const windowManager = remote.require('electron-window-manager')
const { modal } = windowManager.sharedData.fetch('store')

const afsExplorer = new AFSExlorer({
  afsName: modal.contentViewerData.name,
  did: modal.contentViewerData.did,
  fileList: modal.contentViewerData.fileList
})
document.getElementById('container').appendChild(afsExplorer.render({ spinner: modal.contentViewerData.fileList.length === 0 }))

ipcRenderer.on(REFRESH, () => afsExplorer.render({ spinner: false, fileList: modal.contentViewerData.fileList }))
