const { events } = require('k')

module.exports = async (state, { load = null, type }) => {
  switch (type) {
    case events.CLOSE_AFS_EXPLORER:
      state.exportWindowOpen = false
      break
    case events.GETTING_USER_DATA:
    case events.CREATED_USER_DID:
      state.network = load.network
      break
    case events.FEED_CONTENT_VIEWER:
      state.exportWindowOpen = true
      break
    case events.GOT_CACHED_DID:
      state.cachedUserDid = load.did
      break
    case events.GOT_ACCOUNTS:
    case events.CHANGED_NAME:
      state.accounts = load.accounts
      break
    case events.OPEN_DEEPLINK:
      state.deepLinkData = load
      break
    case events.DUMP_DEEPLINK_DATA:
    case events.LOGOUT:
      state.deepLinkData = null
      break
  }
  return state
}
