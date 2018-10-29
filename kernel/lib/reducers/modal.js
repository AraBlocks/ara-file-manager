'use strict'

const k = require('../../../lib/constants/stateManagement')

module.exports = (state, { load = null, type }) => {
  switch(type) {
    case k.DUMP_MODAL_STATE:
    case k.LOGOUT:
      state.data = {}
      break
    case k.FEED_MANAGE_FILE:
    case k.FEED_MODAL:
      state.data = load
      break
    case k.REGISTERED:
      state.data = load.mnemonic
      break
    default:
      return state
  }
  return state
}