const MnemonicWarning = require('../views/mnemonicWarning')
const { ipcRenderer, remote } = require('electron')
const { PAGE_VIEW } = require('../../lib/constants/stateManagement')

const windowManager = remote.require('electron-window-manager')
const store = windowManager.sharedData.fetch('store')

const { modal } = store
const mnemonicWarning = new MnemonicWarning(modal.data)
document.getElementById('container').appendChild(mnemonicWarning.render())

if (modal.data.isAFS) {
  ipcRenderer.send(PAGE_VIEW, { view: 'mnemonicWarning/AFS' })
} else {
  ipcRenderer.send(PAGE_VIEW, { view: 'mnemonicWarning' })
}
