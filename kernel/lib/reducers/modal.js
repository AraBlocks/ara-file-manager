'use strict'

const k = require('../../../lib/constants/stateManagement')

module.exports = (state, { load = null, type }) => {
  switch(type) {
    case k.DUMP_MODAL_STATE:
    case k.LOGOUT:
      state.data = {}
      break
    case k.FEED_MODAL:
      state.data = load
      break
    case k.FEED_MANAGE_FILE:
      state.manageFileData = load
    case k.FEED_CONTENT_VIEWER:
      state.contentViewerData = load
    case k.REGISTERED:
      state.data.mnemonic = load.mnemonic
      state.data.userDID = load.userAid
      state.data.freezeData = true
      break
    default:
      return state
  }
  return state
}