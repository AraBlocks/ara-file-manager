'use strict'

const k = require('../../../lib/constants/stateManagement')

module.exports = async (state, { load = null, type }) => {
  switch (type) {
    case k.GOT_NETWORK:
      state.network = load.network
      break
    default:
      return state
  }
  return state
}