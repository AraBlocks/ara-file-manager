const PurchaseEstimate = require('../views/purchaseEstimate')
const { ipcRenderer, remote } = require('electron')
const { events: k } = require('k')
const windowManager = remote.require('electron-window-manager')
const store = windowManager.sharedData.fetch('store')

const { modal } = store
const purchaseEstimate = new PurchaseEstimate(modal.data)
document.getElementById('container').appendChild(purchaseEstimate.render({}))

const refreshListener = ipcRenderer.on(k.REFRESH, (event, load) => { purchaseEstimate.render(load)} )
window.onunload = () => {
	ipcRenderer.removeListener(k.REFRESH, refreshListener)
}
