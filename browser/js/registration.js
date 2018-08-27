'use strict'

const { closeWindow, openWindow } = require('../lib/tools/windowManagement')
const Registration = require('../views/registration')
const { ipcRenderer } = require('electron')
const { REGISTERED } = require('../../lib/constants/stateManagement')

const registration = new Registration({})
document.getElementById('container').appendChild(registration.render({}))

ipcRenderer.on(REGISTERED, () => {
  openWindow('filemanager')
  closeWindow('registration')
})