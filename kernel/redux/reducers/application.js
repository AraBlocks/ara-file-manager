const k = require('../../../lib/constants/stateManagement')

module.exports = async (state, { load = null, type }) => {
  switch (type) {
    case k.CLOSE_AFS_EXPLORER:
      state.exportWindowOpen = false
      break
    case k.GETTING_USER_DATA:
    case k.REGISTERED:
      state.network = load.network
      break
    case k.FEED_CONTENT_VIEWER:
      state.exportWindowOpen = true
      break
    case k.GOT_CACHED_DID:
      state.cachedUserDid = load.did
      break
    case k.OPEN_DEEPLINK:
      state.deepLinkData = load
      break
    case k.DUMP_DEEPLINK_DATA:
    case k.LOGOUT:
      state.deepLinkData = null
      break
  }
  return state
}