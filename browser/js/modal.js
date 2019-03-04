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
try {
  Component = require('../views/' + current)
} catch (e) {
  functionalComponent = require('../views/modals/' + current)
  const subview = Object.keys(data || {}).includes('modalName') ? `/${data.modalName}` : ''
  ipcRenderer.send(events.PAGE_VIEW, {
    view: `${current}` + `${subview}`
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
}


if(isDev) { window.store = store }