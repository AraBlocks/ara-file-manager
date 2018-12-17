'use strict'

const k = require('../../lib/constants/stateManagement')
const RecoverMnemonic = require('../views/recover')
const windowManagement = require('../lib/tools/windowManagement')
const { remote } = require('electron')
const windowManager = remote.require('electron-window-manager')
const { ipcRenderer } = require('electron')

const recoverMnemonic = new RecoverMnemonic()
document.getElementById('container').appendChild(recoverMnemonic.render({}))

ipcRenderer.on(k.RECOVERING, () => recoverMnemonic.render({ pending: true }))
ipcRenderer.on(k.RECOVERED, () => {
  windowManager.openWindow('filemanager')
  windowManagement.closeWindow('recover')
})
ipcRenderer.on(k.RECOVER_FAILED, () => recoverMnemonic.render({}))