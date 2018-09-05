'use strict'

const debug = require('debug')('acm:browser:js:fileManager')
const {
  DOWNLOADED,
  DOWNLOADING,
  DOWNLOAD_FAILED,
  PUBLISHED,
  PUBLISHING,
  PURCHASING,
  UPLOAD_COMPLETE
} = require('../../lib/constants/stateManagement')
const { ipcRenderer, remote } = require('electron')
const windowManager = remote.require('electron-window-manager')
const store = windowManager.sharedData.fetch('store')

const FileManager = require('../views/fileManager/container')
const fileManager = new FileManager(store)
document.getElementById('container').appendChild(fileManager.render(store))

const setListener = (event) => {
  ipcRenderer.on(event, () => {
    debug('%s heard', event)
    fileManager.render(store)
  })
}

[
  DOWNLOADING,
  DOWNLOAD_FAILED,
  DOWNLOADED,
  PUBLISHING,
  PUBLISHED,
  PURCHASING,
  UPLOAD_COMPLETE
].forEach(setListener)
