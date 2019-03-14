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
    case events.OPEN_MANAGE_FILE_VIEW:
    case events.LOAD_MANAGE_FILE_UPDATE:
      state.manageFileData = load
    case events.FEED_CONTENT_VIEWER:
      state.contentViewerData = load
      break
    case events.CREATED_USER_DID:
      state.data.mnemonic = load.mnemonic
      state.data.freezeData = true
      break
    case events.PUBLISHED:
      state.data.did = load.did
      state.data.mnemonic = load.mnemonic
      state.data.name = load.name
      state.data.isAFS = true
      state.data.freezeData = true
    default:
      return state
  }
  return state
}