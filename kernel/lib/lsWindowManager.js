'use strict'

const debug = require('debug')('acm:kernel:lib:lsWindowManager')
const dispatch = require('./reducers/dispatch')
const { FEED_MODAL } = require('../../lib/constants/stateManagement')
const { getAFSPrice } = require('../lib/actions/afsManager')
const path = require('path')
const windowManager = require('electron-window-manager')

windowManager.setSize = (view) => {
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
    case 'deleteConfirmModal':
      width = 340
      height = 485
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

windowManager.loadURL = (view) => {
  let file
  switch (view) {
    case 'filemanager':
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
  return windowManager.makeFilePath({ file, parent: file.includes('-test') ? 'test' : 'browser' })
}

windowManager.makeFilePath = ({ file, parent }) => `file://${path.resolve(__dirname, '..', '..', parent, 'html', `${file}.html`)}`

windowManager.openDeepLinking = async (deepLinkingUrl) => {
  debug('Opening deeplink: %s', deepLinkingUrl)
  const fileInfo = parseLink()
  try {
    const price = await getAFSPrice({ did: fileInfo.aid })
    dispatch({ type: FEED_MODAL, load: { price, ...fileInfo } })

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
  } catch(err) {
    debug('Deeplink error: %O', err)
  }

  function parseLink() {
    const linkElements = deepLinkingUrl.slice(7).split("/")
    if (linkElements.length === 3 && linkElements[0] == 'download') {
      return {
        aid: linkElements[1],
        fileName: decodeURIComponent(linkElements[2]),
      }
    }
  }
}

windowManager.modalOpenStatus = false

windowManager.pingView = ({ view, event, load = null }) => {
  debug('Pinging %s with %s', view, event)
  const window = windowManager.get(view)
  if (!window) { return }
  window.object.webContents.send(event, load)
}

Object.defineProperty(windowManager, 'modalIsOpen', {
  get: function() { return this.modalOpenStatus },
  set: function(bool) { this.modalOpenStatus = bool }
})

module.exports = windowManager