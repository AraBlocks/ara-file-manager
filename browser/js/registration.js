'use strict'

const windowManagement = require('../lib/tools/windowManagement')
const Registration = require('../views/registration')
const { ipcRenderer } = require('electron')
const k = require('../../lib/constants/stateManagement')

const registration = new Registration({})
document.getElementById('container').appendChild(registration.render({}))

const registeringListener = ipcRenderer.on(k.REGISTERING, () => {
  registration.render({ pending: true })
})

const registeredListener = ipcRenderer.on(k.REGISTERED, () => {
  windowManagement.openModal('araIDWarning')
  windowManagement.closeWindow('registration')
})

window.onunload = () => {
  ipcRenderer.removeListener(k.REGISTERING, registeringListener)
  ipcRenderer.removeListener(k.REGISTERED, registeredListener)
}