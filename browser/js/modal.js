const { emit } = require('../../browser/lib/tools/windowManagement')
const { events } = require('k')
const remote = require('electron').remote
const { ipcRenderer } = require('electron')
const windowManager = remote.require('electron-window-manager')
const isDev = require('electron-is-dev')

const current = windowManager.sharedData.fetch('current')
const store = windowManager.sharedData.fetch('store')
const { modal: { data } } = store

let Component
let functionalComponent
let refreshListener
try {
  Component = require('../views/' + current)
  refreshListener = ipcRenderer.on(events.REFRESH, () => {
    Component.render(store)
  })
} catch (e) {
  functionalComponent = require('../views/modals/' + current)
  const subview = Object.keys(data || {}).includes('modalName') ? `/${data.modalName}` : ''
  ipcRenderer.send(events.PAGE_VIEW, {
    view: `${current}` + `${subview}`
  })
  refreshListener = ipcRenderer.on(events.REFRESH, () => {
    const container = document.getElementById('container')
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(functionalComponent(data))
  })
}

document.getElementById('container').appendChild(
  Component
    ? (new Component).render()
    : functionalComponent(data)
)

window.onunload = () => {
  windowManager.modalIsOpen = false
  if (data.freezeData == false) {
    emit({ event: events.DUMP_MODAL_STATE })
  }
  ipcRenderer.removeListener(events.REFRESH, refreshListener)
}


if(isDev) { window.store = store }
