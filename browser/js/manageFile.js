const ManageFileContainer = require('../views/manageFile/container')
const { events: k } = require('k')
const { ipcRenderer, remote } = require('electron')
const windowManager = remote.require('electron-window-manager')
const { account, modal } = windowManager.sharedData.fetch('store')
const isDev = require('electron-is-dev')

const manageFileContainer = new ManageFileContainer({
	account,
	...modal.manageFileData
})

document.getElementById('container').appendChild(manageFileContainer.render({ spinner: !modal.manageFileData.uncommitted }))

const estimateListener = ipcRenderer.on(k.ESTIMATING_COST, () => manageFileContainer.render({ spinner: true }))
const refreshListener = ipcRenderer.on(k.REFRESH, () => manageFileContainer.render({ spinner: false, fileList: modal.manageFileData.fileList }))
window.onunload = () => {
	ipcRenderer.removeListener(k.REFRESH, refreshListener)
	ipcRenderer.removeListener(k.ESTIMATING_COST, estimateListener)
}

;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  document.body.addEventListener(eventName, preventDefaults, false)
})

function preventDefaults(e) {
  e.preventDefault()
  e.stopPropagation()
}

isDev && (window.store = windowManager.sharedData.fetch('store'))
