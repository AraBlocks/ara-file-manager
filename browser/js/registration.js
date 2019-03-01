const { ipcRenderer } = require('electron')

const Registration = require('../views/registration')
const { stateManagement: k } = require('k')
const windowManagement = require('../lib/tools/windowManagement')

const registration = new Registration()
document.getElementById('container').appendChild(registration.render())

const createdIDListener = ipcRenderer.on(k.CREATED_USER_DID, (_, load) => {
  registration.render({ ...load, inputDisabled: false })
})

const registeredListener = ipcRenderer.on(k.REGISTERED, () => {
  windowManagement.openModal('araIDWarning')
  windowManagement.closeWindow('registration')
})

const registeringListener = ipcRenderer.on(k.REGISTERING, () => {
  registration.render({ pending: true })
})

window.onunload = () => {
  ipcRenderer.removeListener(k.CREATED_USER_DID, createdIDListener)
  ipcRenderer.removeListener(k.REGISTERING, registeringListener)
  ipcRenderer.removeListener(k.REGISTERED, registeredListener)

}

window.onload = () => {
  ipcRenderer.send(k.PAGE_VIEW, { view: 'araIdCreate' })
}
