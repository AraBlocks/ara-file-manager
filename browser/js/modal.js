'use strict'

const { emit } = require('../../browser/lib/tools/windowManagement')
const { DUMP_MODAL_STATE } = require('../../lib/constants/stateManagement')
const remote = require('electron').remote;
const windowManager = remote.require('electron-window-manager')

const current = windowManager.sharedData.fetch('current')
const { modal: { data } } = windowManager.sharedData.fetch('store')

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
  emit({ event: DUMP_MODAL_STATE })
}