'use strict'

const { closeWindow, openModal} = require('./lib/tools/windowManagement')
const {
  ESTIMATING_COST,
  ESTIMATION,
  PUBLISHED,
} = require('../lib/constants/stateManagement')
const PublishFile = require('./views/publishFile/container')
const { ipcRenderer, remote } = require('electron')
const windowManager = remote.require('electron-window-manager')
const { account } = windowManager.sharedData.fetch('store')

const publishFile = new PublishFile({ account })
document.getElementById('container').appendChild(publishFile.render())

ipcRenderer.on(ESTIMATING_COST, () => publishFile.render(true))
ipcRenderer.on(ESTIMATION, () => openModal('publishConfirmModal'))
ipcRenderer.on(PUBLISHED, () => closeWindow.apply(this))
