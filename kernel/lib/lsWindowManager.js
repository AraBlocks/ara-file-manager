'use strict'
const { getAFSPrice } = require('../lib/actions/afsManager')
const path = require('path')
const windowManager = require('electron-window-manager')

windowManager.setSize = function (view) {
  let width
  let height
  switch (view) {
    case 'reDownloadModal':
    case 'generalMessageModal':
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
    case 'generalPleaseWaitModal':
      width = 340
      height = 220
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
      file = 'file-manager'
      break
    case 'developer':
      file = 'index-dev'
      break
    case 'manager':
    case 'mainManagerView':
      file = 'index'
      break
    case 'publishFileView':
      file = 'publish-file'
      break
    case 'registration':
      file = 'registration'
      break
    case 'testing':
      file = 'index-test'
      break
    default:
      file = 'modal'
  }
  return makeFilePath({ file, parent: file.includes('-test') ? 'test' : 'browser' })

  function makeFilePath({ file, parent }) {
    return `file://${path.resolve(__dirname, '..', '..', parent, 'html', `${file}.html`)}`
  }
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