'use strict'

const Ara3 = require('../../lib/ethereum/ara3')
const { privateKey, publicAddress } = require('../../lib/ethereum/account')

module.exports = (app) => {
  app.use((state, emitter) => {
    state.purchaseRequest = {}
    state.ara3 = new Ara3({ privateKey, publicAddress})
    require('./listeners')(state, emitter)
  })
}