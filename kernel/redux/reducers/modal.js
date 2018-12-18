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
      state.data.freezeData = true
      break
    case k.PROXY_DEPLOYED:
      state.data.mnemonic = load.mnemonic
      state.data.isAFS = load.isAFS
      state.data.contentDID = load.contentDID
      state.data.freezeData = true
    case k.USE_UNCOMMITTED:
      state.publishFileData.contentDID = load.contentDID
      break
    default:
      return state
  }
  return state
}