'use strict'
const { getAFSPrice } = require('../lib/actions/afsManager')
const path = require('path')
const windowManager = require('electron-window-manager')

windowManager.setSize = function (view) {
  let width
  let height
  switch (view) {
    case 'failureModal':
    case 'reDownloadModal':
    case 'notEnoughAraModal':
      width = 340
      height = 200
      break
    case 'checkoutModal1':
      width = 340
      height = 270
      break
    case 'fManagerView':
    case 'filemanager':
      width = 490
      height = 730
      break
    case 'login':
      width = 390
      height = 547
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
    case 'publishConfirmModal':
      width = 360
      height = 225
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
      file = `file://${path.resolve(__dirname, '..', '..', 'browser', 'html', 'file-manager.html')}`
      break
    case 'developer':
      file = `file://${path.resolve(__dirname, '..', '..', 'browser', 'html', 'index-dev.html')}`
      break
    case 'manager':
    case 'mainManagerView':
      file = `file://${path.resolve(__dirname, '..', '..', 'browser', 'html', 'index.html')}`
      break
    case 'publishFileView':
      file = `file://${path.resolve(__dirname, '..', '..', 'browser', 'html', 'publish-file.html')}`
      break
    case 'registration':
      file = `file://${path.resolve(__dirname, '..', '..', 'browser', 'html', 'registration.html')}`
      break
    case 'testing':
      file = `file://${path.resolve(__dirname, '..', '..', 'test', 'html', 'index.html')}`
      break
    default:
      file = `file://${path.resolve(__dirname, '..', '..', 'browser', 'html', 'modal.html')}`
  }
  return file
}

windowManager.openDeepLinking = async (deepLinkingUrl) => {
  parseLink()

  try {
    const price = await getAFSPrice({ did: windowManager.fileInfo.aid })
    const modalName = 'reDownloadModal'
    if (windowManager.get(modalName).object != null) { return }
    windowManager.sharedData.set('current', modalName)
    windowManager.createNew(
      modalName,
      modalName,
      windowManager.loadURL(modalName),
      false,
      {
        backgroundColor: 'white',
        frame: false,
        ...windowManager.setSize(modalName),
      }
    ).open()
    windowManager.fileInfo.price = price
  } catch(err) {
    console.log(err)
  }

  function parseLink() {
    const linkElements = deepLinkingUrl.slice(7).split("/")
    if (linkElements.length === 3 && linkElements[0] == 'download') {
      windowManager.fileInfo = {
        aid: linkElements[1],
        fileName: linkElements[2],
      }
    }
  }
}

windowManager.modalOpenStatus = false

Object.defineProperty(windowManager, 'modalIsOpen', {
  get: function() { return this.modalOpenStatus },
  set: function(bool) { this.modalOpenStatus = bool }
})

module.exports = windowManager