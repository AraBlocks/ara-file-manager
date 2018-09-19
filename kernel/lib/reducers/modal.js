'use strict'

const {
  DUMP_MODAL_STATE,
  FEED_MODAL,
  FEED_MANAGE_FILE
} = require('../../../lib/constants/stateManagement')

module.exports = (state, { load, type }) => {
  switch(type) {
    case DUMP_MODAL_STATE:
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