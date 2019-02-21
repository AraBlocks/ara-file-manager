const k = require('../../lib/constants/stateManagement')
const RecoverMnemonic = require('../views/recover')
const windowManagement = require('../lib/tools/windowManagement')
const { remote } = require('electron')
const windowManager = remote.require('electron-window-manager')
const { ipcRenderer } = require('electron')

const recoverMnemonic = new RecoverMnemonic()
document.getElementById('container').appendChild(recoverMnemonic.render({}))

const recoveringListener = ipcRenderer.on(k.RECOVERING, () => recoverMnemonic.render({ pending: true }))
const recoveredListener = ipcRenderer.on(k.RECOVERED, () => {
  windowManager.openWindow('filemanager')
  windowManagement.closeWindow('recover')
})
const recoverFailedListener = ipcRenderer.on(k.RECOVER_FAILED, () => recoverMnemonic.render({}))

window.onunload = () => {
  ipcRenderer.removeListener(k.RECOVERING, recoveringListener)
  ipcRenderer.removeListener(k.RECOVERED, recoveredListener)
  ipcRenderer.removeListener(k.RECOVER_FAILED, recoverFailedListener)
}