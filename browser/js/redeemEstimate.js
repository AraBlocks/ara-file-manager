'use strict'

const RedeemEstimate = require('../views/redeemEstimate')
const { ipcRenderer } = require('electron')
const { stateManagement: k } = require('k')

const redeemEstimate = new RedeemEstimate({
  confirmText: 'Redeem Rewards',
  header: 'Redeed Rewards',
  smallMessageText: 'Before redeeming rewards, you will need to pay a small fee',
  confirmEvent: k.CONFIRM_REDEEM
})
document.getElementById('container').appendChild(redeemEstimate.render({}))

ipcRenderer.on(k.REFRESH, (_, load) => { redeemEstimate.render(load) })
