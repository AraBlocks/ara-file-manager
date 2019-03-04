const { events } = require('k')
const RecoverMnemonic = require('../views/recover')
const windowManagement = require('../lib/tools/windowManagement')
const { remote } = require('electron')
const windowManager = remote.require('electron-window-manager')
const { ipcRenderer } = require('electron')

const recoverMnemonic = new RecoverMnemonic()
document.getElementById('container').appendChild(recoverMnemonic.render({}))

const recoveringListener = ipcRenderer.on(events.RECOVERING, () => recoverMnemonic.render({ pending: true }))
const recoveredListener = ipcRenderer.on(events.RECOVERED, () => {
  windowManager.openWindow('filemanager')
  windowManagement.closeWindow('recover')
})
const recoverFailedListener = ipcRenderer.on(events.RECOVER_FAILED, () => recoverMnemonic.render({}))

window.onunload = () => {
  ipcRenderer.removeListener(events.RECOVERING, recoveringListener)
  ipcRenderer.removeListener(events.RECOVERED, recoveredListener)
  ipcRenderer.removeListener(events.RECOVER_FAILED, recoverFailedListener)
}