'use strict'

const debug = require('debug')('acm:browser:js:publishFile')
const { openModal} = require('../lib/tools/windowManagement')
const {
  ESTIMATING_COST,
  ESTIMATION,
} = require('../../lib/constants/stateManagement')
const PublishFile = require('../views/publishFile/container')
const { ipcRenderer, remote } = require('electron')
const windowManager = remote.require('electron-window-manager')
const { account: { aid } } = windowManager.sharedData.fetch('store')

const publishFile = new PublishFile({
  did: aid.ddo.id,
  password: aid.password
 })
document.getElementById('container').appendChild(publishFile.render({}))

ipcRenderer.on(ESTIMATING_COST, () => {
  debug('%s heard', ESTIMATING_COST)
  publishFile.render({ spinner: true })
})

ipcRenderer.on(ESTIMATION, () => {
  debug('%s heard', ESTIMATION)
  openModal('publishConfirmModal')
})