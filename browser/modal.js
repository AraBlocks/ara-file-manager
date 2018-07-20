'use strict'

const remote = require('electron').remote;
const windowManager = remote.require('electron-window-manager')

const current = windowManager.sharedData.fetch('current')
let Component
let functionalComponent
try {
  Component = require('./views/' + current)
} catch (e) {
  functionalComponent = require('./views/modals/' + current)
}

document.body.appendChild(
  Component
    ? (new Component).render()
    : functionalComponent({})
)