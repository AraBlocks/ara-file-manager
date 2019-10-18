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
    case events.PUBLISH_PROGRESS:
      state.data.step = load.step
      state.data.deployHash = load.deployHash || state.data.deployHash
      state.data.writeHash = load.writeHash || state.data.writeHash
      state.data.priceHash = load.priceHash || state.data.priceHash
      state.data.receipt = load.receipt
      break
    case events.SET_GAS_PRICE:
      state.data.average = load.average
      state.data.fast = load.fast
      state.data.fastest = load.fastest
      state.data.name = load.name
      state.data.paths = load.paths
      state.data.price = load.price
      break
    default:
      return state
  }
  return state
}
