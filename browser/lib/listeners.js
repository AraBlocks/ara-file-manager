'use strict'

const { kPurchaseRequest } = require('../../lib/ipc')
const { ipcRenderer } = require('electron')

module.exports = (state, emitter) => {
  ipcRenderer.once(kPurchaseRequest, (mainEmitter, load) => {
    const keys = Object.keys(load)
    const valid =
      keys.includes('title')
      && keys.includes('description')
      && keys.includes('license')
      && keys.includes('price')

    if (valid) {
      state.purchaseRequest = load
      emitter.emit(state.events.PUSHSTATE, '/confirm')
    }
  })

}