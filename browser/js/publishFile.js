'use strict'

const PublishFile = require('../views/publishFile/container')
const { remote } = require('electron')
const windowManager = remote.require('electron-window-manager')
const { account } = windowManager.sharedData.fetch('store')

const publishFile = new PublishFile({ did: account.userAid, password: account.password})
document.getElementById('container').appendChild(publishFile.render({}))

;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  document.body.addEventListener(eventName, preventDefaults, false)
})

function preventDefaults (e) {
  e.preventDefault()
  e.stopPropagation()
}