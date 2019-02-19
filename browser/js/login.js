const { events: k } = require('k')
console.log(require('k'))
const { ipcRenderer, remote } = require('electron')
const windowManager = remote.require('electron-window-manager')
const { application } = windowManager.sharedData.fetch('store')
const LoginView = require('../views/login')

const loginView = new LoginView({ userDID: application.cachedUserDid || '' })
document.getElementById('container').appendChild(loginView.render())
const refreshListener = ipcRenderer.on(k.REFRESH, () => fileManager.render({ userDID: account.cachedUserDid }))
window.onunload = () => {
	ipcRenderer.removeListener(k.REFRESH, refreshListener)
}
