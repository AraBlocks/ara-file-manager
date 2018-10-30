'use strict'

const k = require('../../lib/constants/stateManagement')
const ImportMnemonic = require('../views/import')
const windowManagement = require('../lib/tools/windowManagement')
const { remote } = require('electron')
const windowManager = remote.require('electron-window-manager')
const { ipcRenderer } = require('electron')

const importMnemonic = new ImportMnemonic()
document.getElementById('container').appendChild(importMnemonic.render({}))

ipcRenderer.on(k.IMPORTING, () => importMnemonic.render({ pending: true }))
ipcRenderer.on(k.IMPORTED, () => {
  windowManager.openWindow('filemanager')
  windowManagement.closeWindow('import')
})