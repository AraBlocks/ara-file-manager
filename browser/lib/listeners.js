'use strict'

const { kPurchaseRequest } = require('../../lib/ipc')
const { ipcRenderer } = require('electron')

module.exports = (state, emitter) => {
  ipcRenderer.once(kPurchaseRequest, (mainEmitter, load) => {
    state.purchaseRequest = load
    emitter.emit(state.events.PUSHSTATE, '/confirm')
  })

}