'use strict'

const k = require('../../../lib/constants/stateManagement')

module.exports = async (state, { load = null, type }) => {
  switch (type) {
    case k.GETTING_USER_DATA:
    case k.REGISTERED:
      state.network = load.network
      break
    case k.GOT_CACHED_DID:
      state.cachedUserDid = load.did
      break
    default:
      return state
  }
  return state
}