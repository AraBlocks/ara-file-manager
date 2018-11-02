'use strict'
const AFSExlorer = require('../views/afsExplorerView/container')
const { remote } = require('electron')
const windowManager = remote.require('electron-window-manager')
const { modal: { contentViewerData } } = windowManager.sharedData.fetch('store')

const afsExplorer = new AFSExlorer({
  afsName: contentViewerData.name,
  did: contentViewerData.did,
  fileList: contentViewerData.fileList
})
document.getElementById('container').appendChild(afsExplorer.render())

;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  document.body.addEventListener(eventName, preventDefaults, false)
})

function preventDefaults (e) {
  e.preventDefault()
  e.stopPropagation()
}