'use strict'

const EstimateSpinner = require('../views/estimateSpinner')
const { ipcRenderer } = require('electron')
const { stateManagement: k } = require('k')

const estimateSpinner = new EstimateSpinner()
document.getElementById('container').appendChild(estimateSpinner.render({}))

ipcRenderer.on(k.REFRESH, (_, load) => estimateSpinner.render(load))