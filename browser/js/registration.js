'use strict'

const debug = require('debug')('acm:browser:js:registration')
const { closeWindow, openWindow } = require('../lib/tools/windowManagement')
const Registration = require('../views/registration')
const { ipcRenderer } = require('electron')
const { REGISTERED } = require('../../lib/constants/stateManagement')

const registration = new Registration({})
document.getElementById('container').appendChild(registration.render({}))

ipcRenderer.on(REGISTERED, () => {
  debug('%s heard in IPC', REGISTERED)
  openWindow('filemanager')
  closeWindow('registration')
})