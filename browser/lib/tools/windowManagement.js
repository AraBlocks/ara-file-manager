const debug = require('debug')('browser:lib:tools:windowManagement')
const {
  ipcRenderer,
  remote,
  shell
} = require('electron')
const windowManager = remote.require('electron-window-manager')
const { events } = require('k')

function changeMainManagerSize(expand) {
  const window = windowManager.getCurrent().object
  window.setSize(400, expand ? 525 : 325)
}

function closeModal(name = null) {
  windowManager.modalIsOpen = false
  closeWindow(name)
}

function closeWindow(name = null) {
  name
    ? windowManager.get(name).object.close()
    : windowManager.getCurrent().object.close()
}

function emit({ event, load = null}) {
  debug('Emit: %o', { event, load })
  ipcRenderer.send(event, load)
}

function minimizeWindow() {
  windowManager.getCurrent().minimize()
}

function openFolder(path) {
  shell.openItem(path)
}

function openModal(view = 'modal') {
  if (windowManager.modalIsOpen) {
    windowManager.get('modal').focus()
  } else {
    const center = calculateCenter(view)
    windowManager.sharedData.set('current', view)
    windowManager.open(
      view,
      view,
      windowManager.loadURL(view),
      false,
      {
        backgroundColor: 'white',
        frame: false,
        position: center,
        ...windowManager.setSize(view),
      }
    )
    windowManager.modalIsOpen = true
  }
}

function transitionModal(view) {
  const current = windowManager.getCurrent().object
  windowManager.sharedData.set('current', view)

  windowManager.modalIsOpen = false
  openModal(view)
  current.close()
}

function openWindow(view) {
  ipcRenderer.send(events.PAGE_VIEW, { view })
  const center = calculateCenter(view)
  windowManager.get(view)
    ? windowManager.get(view).focus()
    : windowManager.open(
        view,
        view,
        windowManager.loadURL(view),
        false,
        {
          backgroundColor: 'white',
          frame: false,
          position: center,
          ...windowManager.setSize(view)
        }
      )
}

function setWindowSize(width, height, animated = false) {
  windowManager.getCurrent().object.setSize(width, height, animated)
}

function quitApp() {
  windowManager.closeAll()
}

function getStore() {
  return windowManager.sharedData.fetch('store')
}

function calculateCenter(view) {
  try {
    const fm = windowManager.get('filemanager')
    const { width, height } = windowManager.setSize(view)
    const [x, y] = fm.object.getPosition()
    const [fmWidth, fmHeight] = fm.object.getSize()
    return [x + Math.round(fmWidth/2) - Math.round(width/2), y + Math.round(fmHeight/2) - Math.round(height/2)]
  } catch (err) {
    debug('error calculating FM window center')
  }
}

module.exports = {
  changeMainManagerSize,
  closeModal,
  closeWindow,
  emit,
  openModal,
  minimizeWindow,
  transitionModal,
  openFolder,
  openWindow,
  setWindowSize,
  quitApp,
  getStore
}
