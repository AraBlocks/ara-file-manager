'use strict'

module.exports = (app) => {
  app.use((state, emitter) => {
    state.purchaseRequest = {}
    require('./listeners')(state, emitter)
  })
}