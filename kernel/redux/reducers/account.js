const { events } = require('k')
const { account: INITIAL_STATE } = require('../store')

module.exports = async (state, { load = null, type }) => {
  switch (type) {
    case events.CHANGE_PENDING_PUBLISH_STATE:
      state.pendingPublish = load.pendingPublish
      break
    case events.FAUCET_ARA_RECEIVED:
      state.faucetStatus = null
      break
    case events.FAUCET_ERROR:
      state.faucetStatus = events.FAUCET_ERROR
      break
    case events.FAUCET_LIMIT_HIT:
      state.faucetStatus = events.FAUCET_LIMIT_HIT
      break
    case events.GETTING_USER_DATA:
      state.userDID = load.userDID
      break
    case events.GREYLISTED_FROM_FAUCET:
      state.faucetStatus = events.GREYLISTED_FROM_FAUCET
      break
    case events.IN_FAUCET_QUEUE:
      state.faucetStatus = events.IN_FAUCET_QUEUE
      break
    case events.CREATED_USER_DID:
    case events.LOGIN:
    case events.RECOVERED:
    case events.REGISTERED:
      Object.assign(state, load)
      state.faucetStatus = null
      break
    case events.CHANGED_NAME:
      state.username = load.username
      break;
    case events.LOGOUT:
      state = INITIAL_STATE
      break
    case events.PUBLISHED:
      state.userBalance = load.balance
      break
    case events.UPDATE_ARA_BALANCE:
    case events.UPDATE_ETH_BALANCE:
    case events.PURCHASED:
      state.araBalance = load.araBalance || state.araBalance
      state.ethBalance = load.ethBalance || state.ethBalance
      break
    case events.TOGGLE_ANALYTICS_PERMISSION:
      state.analyticsPermission = load.analyticsPermission
      break
    default:
      return state
  }
  return state
}
