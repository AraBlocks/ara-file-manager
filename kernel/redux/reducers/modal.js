const { events } = require('k')

module.exports = (state, { load = null, type }) => {
  switch(type) {
    case events.DUMP_MODAL_STATE:
    case events.LOGOUT:
      state.data = {}
      break
    case events.FEED_MODAL:
      state.data = load
      break
    case events.FEED_MANAGE_FILE:
      state.manageFileData = load
    case events.FEED_CONTENT_VIEWER:
      state.contentViewerData = load
      break
    case events.CREATED_USER_DID:
      state.data.mnemonic = load.mnemonic
      state.data.freezeData = true
      break
    case events.PROXY_DEPLOYED:
      state.data.mnemonic = load.mnemonic
      state.data.isAFS = load.isAFS
      state.data.contentDID = load.contentDID
      state.data.freezeData = true
    case events.USE_UNCOMMITTED:
      state.publishFileData.contentDID = load.contentDID
      break
    default:
      return state
  }
  return state
}