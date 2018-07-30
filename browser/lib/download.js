'use strict'

const { DOWNLOAD } = require('../../lib/constants/stateManagement')
const { ipcRenderer, remote } = require('electron')
const windowManager = remote.require('electron-window-manager')

module.exports = () => ipcRenderer.send(DOWNLOAD, windowManager.fileInfo.aid)