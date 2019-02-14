const AccountInfo = require('../views/accountInfo')
const { ipcRenderer, remote } = require('electron')
const { events: k } = require('k')
const windowManager = remote.require('electron-window-manager')
const store = windowManager.sharedData.fetch('store')
const isDev = require('electron-is-dev')

const accountInfo = new AccountInfo(store)
document.getElementById('container').appendChild(accountInfo.render(store))

const refreshListener = ipcRenderer.on(k.REFRESH, () => accountInfo.render(store))
window.onunload = () => {
	ipcRenderer.removeListener(k.REFRESH, refreshListener)
}

isDev && Object.assign(window, { store })
