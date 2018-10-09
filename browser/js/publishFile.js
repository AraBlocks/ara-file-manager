'use strict'

const { openModal } = require('../lib/tools/windowManagement')
const { ESTIMATING_COST, ESTIMATION } = require('../../lib/constants/stateManagement')
const PublishFile = require('../views/publishFile/container')
const { ipcRenderer, remote } = require('electron')
const windowManager = remote.require('electron-window-manager')
const { account } = windowManager.sharedData.fetch('store')

const publishFile = new PublishFile({ did: account.userAid, password: account.password})
document.getElementById('container').appendChild(publishFile.render({}))

ipcRenderer.on(ESTIMATING_COST, () => publishFile.render({ spinner: true }))
ipcRenderer.on(ESTIMATION, () => openModal('publishConfirmModal'))