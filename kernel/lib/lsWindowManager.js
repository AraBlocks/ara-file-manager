const debug = require('debug')('ara:fm:kernel:lib:lsWindowManager')
const analytics = require('../daemons/analytics')
const { events } = require('k')
const EventEmitter = require('events')
const path = require('path')
const windowManager = require('electron-window-manager')

windowManager.internalEmitter = new EventEmitter

windowManager.openModal = (modalName) => {
  debug('%s heard', events.OPEN_MODAL)
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
}

windowManager.closeModal = (modalName) => {
  windowManager.get(modalName).object
    ? windowManager.get(modalName).object.close()
    : null
}

windowManager.setSize = (view) => {
  let width
  let height
  switch (view) {
    case 'afsExplorerView':
      width = 600
      height = 700
      break
    case 'accountInfo':
      width = 325
      height = 630
      break
    case 'developer':
      width = 300
      height = 500
      break
    case 'redeemConfirmModal':
    case 'reDownloadModal':
    case 'generalMessageModal':
      width = 340
      height = 200
      break
    case 'purchaseEstimate':
      width = 340
      height = 350
      break
    case 'deleteConfirmModal':
      width = 340
      height = 485
      break
    case 'filemanager':
      width = 866
      height = 950
      break
    case 'generalPleaseWaitModal':
    case 'generalActionModal':
      width = 340
      height = 220
      break
    case 'login':
      width = 350
      height = 547
      break
    case 'mainManagerView':
    case 'manager':
    case 'mnemonicWarning':
    case 'araIDWarning':
      width = 400
      height = 325
      break
    case 'manageFileView':
    case 'publishFileView':
      width = 650
      height = 730
      break
    case 'estimateSpinner':
    case 'publishConfirmModal':
      width = 360
      height = 230
      break
    case 'publishSuccessModal':
      width = 340
      height = 300
      break
    case 'publishProgressModal':
      width = 500
      height = 300
      break
    case 'purchaseProgressModal':
      width = 300
      height = 300
      break
    case 'redeemProgressModal':
      width = 250
      height = 300
      break
    case 'registration':
      width = 400
      height = 350
      break
    case 'recover':
      width = 400
      height = 390
      break
    case 'setGasModal':
      width = 390
      height = 420
      break
    case 'testing':
      width = 550
      height = 900
      break
    case 'confirmSendModal':
      width = 360
      height = 240
      break
    case 'updateConfirmModal':
      width = 340
      height = 210
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
    case 'accountInfo':
      file = 'account-info'
      break
    case 'afsExplorerView':
      file = 'afs-explorer-view'
      break
    case 'araIDWarning':
      file = 'ara-id-warning'
      break
    case 'purchaseEstimate':
      file = 'purchase-estimate'
      break
    case 'filemanager':
      file = 'file-manager'
      break
    case 'estimateSpinner':
      file = 'estimate-spinner'
      break
    case 'developer':
      file = 'index-dev'
      break
    case 'recover':
      file = 'recover'
      break
    case 'login':
      file = 'login'
      break
    case 'manager':
    case 'manageFileView':
      file = 'manage-file'
      break
    case 'mainManagerView':
      file = 'index'
      break
    case 'mnemonicWarning':
      file = 'mnemonic-warning'
      break
    case 'publishFileView':
      file = 'publish-file'
      break
    case 'registration':
      file = 'registration'
      break
    case 'sendAra':
      file = 'send-ara'
      break
    case 'testing':
      file = 'index-test'
      break
    default:
      file = 'modal'
  }
  return windowManager.makeFilePath({ file, parent: file.includes('-test') ? 'test' : 'browser' })
}

windowManager.makeFilePath = ({ file, parent }) => `file://${path.resolve(__dirname, '..', '..', parent, 'html', `${file}` + ".html")}`

windowManager.openDeepLinking = async (deepLinkingUrl) => {
  debug('Opening deeplink')
  try {
    const fileInfo = parseLink()
    windowManager.internalEmitter.emit(events.OPEN_DEEPLINK, fileInfo)
    return
  } catch (err) {
    debug('Deeplink error: %O', err)
  }

  function parseLink() {
    const linkElements = deepLinkingUrl.slice(6).split("/")
    if (linkElements.length === 3 && linkElements[0] == 'download') {
      return {
        did: linkElements[1],
        fileName: decodeURIComponent(linkElements[2]),
        author: null
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

windowManager.pingAll = ({ event, load = null }) => {
  const views = ['filemanager', 'publishFileView', 'manageFileView', 'accountInfo']
  views.forEach((view) => windowManager.pingView({ view, event, load }))
}

windowManager.closeWindow = (name) => {
  windowManager.get(name) && windowManager.get(name).object.close()
}

windowManager.openWindow = (view) => {
  analytics.trackScreenView(view)
  return windowManager.get(view)
    ? windowManager.get(view).focus()
    : windowManager.open(
      view,
      view,
      windowManager.loadURL(view),
      false,
      {
        backgroundColor: 'white',
        frame: false,
        titleBarStyle: 'hidden',
        ...windowManager.setSize(view),
        menu: null,
        maximizable: false
      }
    )
}

Object.defineProperty(windowManager, 'modalIsOpen', {
  get: function () { return this.modalOpenStatus },
  set: function (bool) { this.modalOpenStatus = bool }
})

module.exports = windowManager
