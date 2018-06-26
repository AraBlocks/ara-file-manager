'use strict'

const Ara3 = require('../../lib/ethereum/ara3')
const id = require('../../lib/id')
const Navigator = require('./navigator')
const { privateKey, publicAddress } = require('../../lib/ethereum/account')

module.exports = (app) => {
  app.use((state, emitter) => {
    state.purchaseRequest = {}

    Object.assign(state,{
      purchaseRequest: {},
      ara3: new Ara3({ privateKey, publicAddress}),
      navigator: new Navigator([])
    })

    state.navigator.on(Navigator.NAVIGATE, (href) => {
      setImmediate(() => location.href = href)
    })

    Object.assign(window.navigator, { bridge: createBridge() })
    Object.assign(window.location, { bridge: createBridge() })
    function createBridge() {
      return {
        set hash(hash = '') {
          window.location.hash = id.create(hash)
        },

        get hash() {
          return id.lookup(window.location.hash.replace('#', '')) || ''
        }
      }
    }

    require('./listeners')(state, emitter)
  })
}