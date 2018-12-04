'use strict'

const k = require('../../../lib/constants/stateManagement')

module.exports = async (state, { load = null, type }) => {
  switch (type) {
    case k.GETTING_USER_DATA:
      state.network = load.network
      break
    default:
      return state
  }
  return state
}