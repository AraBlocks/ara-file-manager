'use strict'
const path = require('path')
const windowManager = require('electron-window-manager')

windowManager.setSize = function (view) {
  let width
  let height
  switch (view) {
    case 'registration':
      width = 400
      height = 350
      break
    case 'fManagerView':
    case 'filemanager':
      width = 520
      height = 730
      break
    case 'mainManagerView':
    case 'manager':
      width = 400
      height = 325
      break
    default:
      width = 300
      height = 300
  }
  return { width, height }
}

windowManager.loadURL = function (view) {
  let file
  switch (view) {
    case 'filemanager':
      file = `file://${path.resolve(__dirname, '..', '..', 'browser/file-manager.html')}`
      break
    case 'developer':
      file = `file://${path.resolve(__dirname, '..', '..', 'browser/index-dev.html')}`
      break
    default:
      file = `file://${path.resolve(__dirname, '..', '..', 'browser/popup.html')}`
  }
  return file
}

module.exports = windowManager