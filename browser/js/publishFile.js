'use strict'

const windowManagement = require('../lib/tools/windowManagement')
const k = require('../../lib/constants/stateManagement')
const PublishFile = require('../views/publishFile/container')
const { ipcRenderer, remote } = require('electron')
const windowManager = remote.require('electron-window-manager')
const { account } = windowManager.sharedData.fetch('store')

const publishFile = new PublishFile({ did: account.userAid, password: account.password})
document.getElementById('container').appendChild(publishFile.render({}))

ipcRenderer.on(k.ESTIMATING_COST, () => windowManagement.openModal('generalPleaseWaitModal'))
ipcRenderer.on(k.ESTIMATION, () => {
  windowManagement.closeModal('generalPleaseWaitModal')
  windowManagement.openModal('publishConfirmModal')
})

;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  document.body.addEventListener(eventName, preventDefaults, false)
})

function preventDefaults (e) {
  e.preventDefault()
  e.stopPropagation()
}