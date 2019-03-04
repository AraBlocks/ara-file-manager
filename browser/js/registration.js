const { ipcRenderer } = require('electron')

const Registration = require('../views/registration')
const { events } = require('k')
const windowManagement = require('../lib/tools/windowManagement')

const registration = new Registration()
document.getElementById('container').appendChild(registration.render())

const createdIDListener = ipcRenderer.on(events.CREATED_USER_DID, (_, load) => {
  registration.render({ ...load, inputDisabled: false })
})

const registeredListener = ipcRenderer.on(events.REGISTERED, () => {
  windowManagement.openModal('araIDWarning')
  windowManagement.closeWindow('registration')
})

const registeringListener = ipcRenderer.on(events.REGISTERING, () => {
  registration.render({ pending: true })
})

window.onunload = () => {
  ipcRenderer.removeListener(events.CREATED_USER_DID, createdIDListener)
  ipcRenderer.removeListener(events.REGISTERING, registeringListener)
  ipcRenderer.removeListener(events.REGISTERED, registeredListener)

}

window.onload = () => {
  ipcRenderer.send(events.PAGE_VIEW, { view: 'araIdCreate' })
}
