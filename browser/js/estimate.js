'use strict'

const Estimate = require('../views/estimate')
const { ipcRenderer, remote } = require('electron')
const { REFRESH } = require('../../lib/constants/stateManagement')
const windowManager = remote.require('electron-window-manager')
const store = windowManager.sharedData.fetch('store')

const { modal } = store
const estimate = new Estimate(modal.data)
document.getElementById('container').appendChild(estimate.render({}))

ipcRenderer.on(REFRESH, (event, load) => { estimate.render(load)} )