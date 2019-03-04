const { events } = require('k')
const { ipcRenderer, remote } = require('electron')
const windowManager = remote.require('electron-window-manager')
const { application } = windowManager.sharedData.fetch('store')
const LoginView = require('../views/login')

const loginView = new LoginView({ userDID: application.cachedUserDid || '' })
document.getElementById('container').appendChild(loginView.render())
const refreshListener = ipcRenderer.on(events.REFRESH, () => fileManager.render({ userDID: account.cachedUserDid }))
window.onunload = () => {
	ipcRenderer.removeListener(events.REFRESH, refreshListener)
}
