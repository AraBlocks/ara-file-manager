 const DeployEstimate = require('../views/deployEstimateView')
const { ipcRenderer, remote } = require('electron')
const { REFRESH } = require('../../lib/constants/stateManagement')
const windowManager = remote.require('electron-window-manager')
const store = windowManager.sharedData.fetch('store')
const isDev = require('electron-is-dev')


const deployEstimate = new DeployEstimate({})
document.getElementById('container').appendChild(deployEstimate.render({}))

//ipcRenderer.on(REFRESH, () => accountInfo.render(store))