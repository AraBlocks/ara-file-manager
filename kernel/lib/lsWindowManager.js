'use strict'
const path = require('path')
const windowManager = require('electron-window-manager')

windowManager.setSize = function (view) {
  let width
  let height
  switch (view) {
    case 'checkoutModal1':
      width = 340
      height = 270
      break
    case 'fManagerView':
    case 'filemanager':
      width = 520
      height = 730
      break
    case 'login':
      width = 390
      height = 547
      break
    case 'manageFileView':
      width = 650
      height = 620
      break
    case 'mainManagerView':
    case 'manager':
      width = 400
      height = 325
      break
    case 'publishFileView':
      width = 650
      height = 490
      break
    case 'registration':
      width = 400
      height = 350
      break
    case 'testing':
      width = 550
      height = 900
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
    case 'fManagerView':
      file = `file://${path.resolve(__dirname, '..', '..', 'browser/file-manager.html')}`
      break
    case 'developer':
      file = `file://${path.resolve(__dirname, '..', '..', 'browser/index-dev.html')}`
      break
    case 'manager':
    case 'manageFileView':
      file = `file://${path.resolve(__dirname, '..', '..', 'browser/manageFile.html')}`
      break
    case 'mainManagerView':
      file = `file://${path.resolve(__dirname, '..', '..', 'browser/index.html')}`
      break
    case 'publishFileView':
      file = `file://${path.resolve(__dirname, '..', '..', 'browser/publish-file.html')}`
      break
    case 'testing':
      file = `file://${path.resolve(__dirname, '..', '..', 'test/index.html')}`
      break
    default:
      file = `file://${path.resolve(__dirname, '..', '..', 'browser/modal.html')}`
  }
  return file
}

windowManager.modalOpenStatus = false

Object.defineProperty(windowManager, 'modalIsOpen', {
  get: function() { return this.modalOpenStatus },
  set: function(bool) { this.modalOpenStatus = bool }
})

module.exports = windowManager