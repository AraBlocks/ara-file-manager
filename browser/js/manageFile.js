const ManageFileContainer = require('../views/manageFile/container')
const k = require('../../lib/constants/stateManagement')
const { ipcRenderer, remote } = require('electron')
const windowManager = remote.require('electron-window-manager')
const { account, modal } = windowManager.sharedData.fetch('store')
const isDev = require('electron-is-dev')

const manageFileContainer = new ManageFileContainer({
	account,
	...modal.manageFileData
})

document.getElementById('container').appendChild(manageFileContainer.render({ spinner: !modal.manageFileData.uncommitted }))

ipcRenderer.on(k.ESTIMATING_COST, () => manageFileContainer.render({ spinner: true }))
ipcRenderer.on(k.REFRESH, () => manageFileContainer.render({ spinner: false, fileList: modal.manageFileData.fileList }))

;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  document.body.addEventListener(eventName, preventDefaults, false)
})

function preventDefaults(e) {
  e.preventDefault()
  e.stopPropagation()
}

isDev && (window.store = windowManager.sharedData.fetch('store'))