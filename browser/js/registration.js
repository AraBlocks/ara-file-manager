const { ipcRenderer } = require('electron')
const { stateManagement: k } = require('k')

const Registration = require('../views/registration')
const windowManagement = require('../lib/tools/windowManagement')

const registration = new Registration()
document.getElementById('container').appendChild(registration.render())

// const registeringListener = ipcRenderer.on(k.REGISTERING, () => {
//   registration.render({ pending: true })
// })

const registeredListener = ipcRenderer.on(k.CREATED_USER_DID, (_, load) => {
  // windowManagement.openModal('araIDWarning')
  // windowManagement.closeWindow('registration')
  registration.render({ ...load, inputDisabled: false })
})

window.onunload = () => {
  // ipcRenderer.removeListener(k.REGISTERING, registeringListener)
  ipcRenderer.removeListener(k.CREATED_USER_DID, registeredListener)
}