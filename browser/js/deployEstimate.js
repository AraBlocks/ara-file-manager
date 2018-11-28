 const DeployEstimate = require('../views/deployEstimateView')
const { ipcRenderer, remote } = require('electron')
const { REFRESH } = require('../../lib/constants/stateManagement')

const deployEstimate = new DeployEstimate({})
document.getElementById('container').appendChild(deployEstimate.render({}))

ipcRenderer.on(REFRESH, (event, load) => { deployEstimate.render({ estimate: load })} )