'use strict'

const windowManagement = require('../lib/tools/windowManagement')
const Registration = require('../views/registration')
const { ipcRenderer } = require('electron')
const k = require('../../lib/constants/stateManagement')

const registration = new Registration({})
document.getElementById('container').appendChild(registration.render({}))

ipcRenderer.on(k.REGISTERING, () => {
  registration.render({ pending: true })
})

ipcRenderer.on(k.REGISTERED, () => {
  windowManagement.openModal('mnemonicWarning')
  windowManagement.closeWindow('registration')
})