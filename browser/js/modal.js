const { emit } = require('../lib/tools/windowManagement')
const { events: k } = require('k')
const remote = require('electron').remote
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
}

document.getElementById('container').appendChild(
  Component
    ? (new Component).render()
    : functionalComponent(data)
)

window.onunload = () => {
  windowManager.modalIsOpen = false
  if (data.freezeData == false) {
    emit({ event: k.DUMP_MODAL_STATE })
  }
}

if(isDev) { window.store = store }
