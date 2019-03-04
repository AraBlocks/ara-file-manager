const EstimateSpinner = require('../views/estimateSpinner')
const { ipcRenderer, remote } = require('electron')
const { events } = require('k')
const windowManager = remote.require('electron-window-manager')
const { views } = windowManager.sharedData.fetch('store')
const initProps = require('../js/estimateSpinner/initProps')

const initialProps = initProps[views.estimateSpinner.type]
const estimateSpinner = new EstimateSpinner({ ...views.estimateSpinner, ...initialProps})
document.getElementById('container').appendChild(estimateSpinner.render({}))

const refreshListener = ipcRenderer.on(events.REFRESH, (_, load) => estimateSpinner.render(load))

window.onunload = () => {
	ipcRenderer.removeListener(events.REFRESH, refreshListener)
}