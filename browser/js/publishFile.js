'use strict'

const PublishFile = require('../views/publishFile/container')
const { REFRESH } = require('../../lib/constants/stateManagement')
const { ipcRenderer ,remote } = require('electron')
const windowManager = remote.require('electron-window-manager')
const { account, modal: { publishFileData: { contentDID } } } = windowManager.sharedData.fetch('store')

const publishFile = new PublishFile({ account, contentDID })
document.getElementById('container').appendChild(publishFile.render({}))

ipcRenderer.on(REFRESH, () => publishFile.render({}));

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  document.body.addEventListener(eventName, preventDefaults, false)
})

function preventDefaults (e) {
  e.preventDefault()
  e.stopPropagation()
}