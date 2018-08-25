'use strict'

const path = require('path')
const modals = path.resolve(__dirname, '..', 'views', 'modals')
const views = path.resolve(__dirname , '..', 'views')

const fs = require('fs')
const remote = require('electron').remote;
const { argv } = remote.process
const windowManager = remote.require('electron-window-manager')

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


if (argv.includes('loggedin')) {
  const { LOGIN_DEV } = require('../lib/constants/stateManagement')
  void async function() {
    windowManager.bridge.emit(LOGIN_DEV, {
      password: argv[argv.length - 1],
      afsId: argv[argv.length - 2]
    })
  }()
}

window.store = windowManager.sharedData.fetch('store')
