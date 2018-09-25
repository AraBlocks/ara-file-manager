'use strict'

const {
  DUMP_MODAL_STATE,
  FEED_MODAL,
  FEED_MANAGE_FILE,
  LOGOUT
} = require('../../../lib/constants/stateManagement')

module.exports = (state, { load = null, type }) => {
  switch(type) {
    case DUMP_MODAL_STATE:
    case LOGOUT:
      state.data = {}
      break
    case FEED_MODAL:
      state.data = load
      break
    case FEED_MANAGE_FILE:
      state.manageFileData = load
    default:
    return state
  }
  return state
}