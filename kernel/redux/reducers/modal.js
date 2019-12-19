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
      break
    case events.THREE_STEP_PROGRESS:
      state.data.step = load.step
      state.data.modalName = load.modalName || state.data.modalName
      state.data.stepNames = load.stepNames || state.data.stepNames
      state.data.retryEvent = load.retryEvent || state.data.retryEvent
      state.data.network = load.network || state.data.network
      state.data.stepOneHash = load.stepOneHash || state.data.stepOneHash
      state.data.stepTwoHash = load.stepTwoHash || state.data.stepTwoHash
      state.data.stepThreeHash = load.stepThreeHash || state.data.stepThreeHash
      break
    case events.TWO_STEP_PROGRESS:
      state.data.step = load.step
      state.data.modalName = load.modalName || state.data.modalName
      state.data.stepNames = load.stepNames || state.data.stepNames
      state.data.retryEvent = load.retryEvent || state.data.retryEvent
      state.data.network = load.network || state.data.network
      state.data.stepOneHash = load.stepOneHash || state.data.stepOneHash
      state.data.stepTwoHash = load.stepTwoHash || state.data.stepTwoHash
      break
    case events.ONE_STEP_PROGRESS:
      state.data.step = load.step
      state.data.modalName = load.modalName || state.data.modalName
      state.data.stepName = load.stepName || state.data.stepName
      state.data.retryEvent = load.retryEvent || state.data.retryEvent
      state.data.network = load.network || state.data.network
      state.data.hash = load.hash || state.data.hash
      break
    case events.PUBLISH_FILE_LOAD:
      state.publishFileData.name = load.name || state.publishFileData.name
      state.publishFileData.paths = load.paths || state.publishFileData.paths
      state.publishFileData.price = load.price || state.publishFileData.price
      state.publishFileData.did = load.did || state.publishFileData.did
      state.publishFileData.mnemonic = load.mnemonic || state.publishFileData.mnemonic
      state.publishFileData.size = load.size || state.publishFileData.size
      break
    case events.PURCHASE_FILE_LOAD:
      state.purchaseFileData.did = load.did
      state.purchaseFileData.fileName = load.fileName
      state.purchaseFileData.author = load.author
      break
    case events.REDEEM_FILE_LOAD:
      state.redeemFileData.did = load.did
      break
    case events.UPDATE_FILE_LOAD:
      Object.assign(state.updateFileData, load)
      break
    case events.SET_GAS_PRICE:
      state.data.average = load.average
      state.data.fast = load.fast
      state.data.fastest = load.fastest
      state.data.step = load.step
      break
    default:
      return state
  }
  return state
}
