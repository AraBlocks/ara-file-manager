'use strict'

const { DUMP_MODAL_STATE, FEED_MODAL } = require('../../../lib/constants/stateManagement')

module.exports = (state, { load, type }) => {
  switch(type) {
    case DUMP_MODAL_STATE:
      state.data = {}
      break
    case FEED_MODAL:
      state.data = load
      break
    default:
    return state
  }
  return state
}