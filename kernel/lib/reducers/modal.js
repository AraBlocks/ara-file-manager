'use strict'

const debug = require('debug')('acms:modal')
const { DUMP_MODAL_STATE, FEED_MODAL } = require('../../../lib/constants/stateManagement')

module.exports = (state, { load, type }) => {
  debug('Old state: %O', state)
  switch(type) {
    case DUMP_MODAL_STATE:
      state.data = {}
      break
    case FEED_MODAL:
      state.data = load
      break
    default:
    debug('New state: %O', state)
    return state
  }
  return state
}