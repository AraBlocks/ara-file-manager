'use strict'

const fs = require('fs')
const remote = require('electron').remote;
const windowManager = remote.require('electron-window-manager')
const windowManagement = require('./lib/store/windowManagement')
const views = __dirname + '/views/'
const modals = __dirname + '/views/modals/'

const exclude = [
  'fileManager.js',
  'styles',
  'modals',
  'fileManager',
  'mainManager',
  'styles.js',
  'publishFile'
 ]

fs.readdirSync(views).forEach((view) => createElement(view, false))
fs.readdirSync(modals).forEach(modal => createElement(modal, true))

function createElement(view, isModal = false) {
  if (exclude.includes(view)) { return }
  view = view.slice(0, -3)

  const handler = (e) => {
    windowManager.bridge.emit(view)
    windowManager.sharedData.set('current', view)
  }

  const button = document.createElement('button')
  button.innerHTML = view
  button.onclick = handler
  button.style.padding = '.5em'
  button.style.margin = '5px'
  const div = isModal
    ? document.getElementById('modal-holder')
    : document.getElementById('view-holder')
  div.appendChild(button)
}
