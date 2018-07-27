'use strict'

const { FEED_MODAL } = require('../../../lib/constants/stateManagement')

module.exports = (state, { load, type }) => {
  switch(type) {
    case FEED_MODAL:
      state.data = load
      break
    default:
    return state
  }
  return state
}