const AccountInfo = require('../views/accountInfo')
const { ipcRenderer, remote } = require('electron')
const { events } = require('k')
const windowManager = remote.require('electron-window-manager')
const store = windowManager.sharedData.fetch('store')
const isDev = require('electron-is-dev')

const accountInfo = new AccountInfo(store)
const customTitlebar = require('custom-electron-titlebar')
new customTitlebar.Titlebar({
    backgroundColor: customTitlebar.Color.WHITE,
    shadow: false,
    menu: null,
    titleHorizontalAlignment: process.platform === 'win32' ? 'left' : 'center',
    maximizable: false,
}).updateTitle(' ')
document.getElementById('container').appendChild(accountInfo.render(store))

const refreshListener = ipcRenderer.on(events.REFRESH, () => accountInfo.render(store))
window.onunload = () => {
	ipcRenderer.removeListener(events.REFRESH, refreshListener)
}

isDev && Object.assign(window, { store })
