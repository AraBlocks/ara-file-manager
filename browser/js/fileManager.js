'use strict'

const { LOADING_LIBRARY, REFRESH } = require('../../lib/constants/stateManagement')
const { ipcRenderer, remote } = require('electron')
const windowManager = remote.require('electron-window-manager')
const store = windowManager.sharedData.fetch('store')

const FileManager = require('../views/fileManager/container')
const fileManager = new FileManager(store)
document.getElementById('container').appendChild(fileManager.render({ store }))

ipcRenderer.on(REFRESH, () => fileManager.render({ store }))
ipcRenderer.on(LOADING_LIBRARY, () => fileManager.render({ store, loadingLibrary: true }))

