'use strict'

const DeployEstimate = require('../views/deployEstimate')
const { ipcRenderer } = require('electron')
const { REFRESH } = require('../../lib/constants/stateManagement')

const deployEstimate = new DeployEstimate()
document.getElementById('container').appendChild(deployEstimate.render({}))

ipcRenderer.on(REFRESH, (event, load) => { deployEstimate.render(load)} )