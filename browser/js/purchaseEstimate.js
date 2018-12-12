'use strict'

const PurchaseEstimate = require('../views/purchaseEstimate')
const { ipcRenderer, remote } = require('electron')
const { REFRESH } = require('../../lib/constants/stateManagement')
const windowManager = remote.require('electron-window-manager')
const store = windowManager.sharedData.fetch('store')

const { modal } = store
const purchaseEstimate = new PurchaseEstimate(modal.data)
document.getElementById('container').appendChild(purchaseEstimate.render({}))

ipcRenderer.on(REFRESH, (event, load) => { purchaseEstimate.render(load)} )