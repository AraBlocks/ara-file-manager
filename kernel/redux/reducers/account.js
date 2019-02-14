const { stateManagement: k } = require('k')
const { account: INITIAL_STATE } = require('../store')

module.exports = async (state, { load = null, type }) => {
  switch (type) {
    case k.CHANGE_PENDING_PUBLISH_STATE:
      state.pendingPublish = load.pendingPublish
      break
    case k.FAUCET_ARA_RECEIVED:
      state.faucetStatus = null
      break
    case k.FAUCET_ERROR:
      state.faucetStatus = k.FAUCET_ERROR
      break
    case k.FAUCET_LIMIT_HIT:
      state.faucetStatus = k.FAUCET_LIMIT_HIT
      break
    case k.GETTING_USER_DATA:
      state.userDID = load.userDID
      break
    case k.GREYLISTED_FROM_FAUCET:
      state.faucetStatus = k.GREYLISTED_FROM_FAUCET
      break
    case k.IN_FAUCET_QUEUE:
      state.faucetStatus = k.IN_FAUCET_QUEUE
      break
    case k.LOGIN:
    case k.REGISTERED:
    case k.RECOVERED:
      Object.assign(state, load)
      break
    case k.LOGOUT:
      state = INITIAL_STATE
      break
    case k.PUBLISHED:
      state.userBalance = load.balance
      break
    case k.UPDATE_ARA_BALANCE:
    case k.UPDATE_ETH_BALANCE:
    case k.PURCHASED:
      state.araBalance = load.araBalance || state.araBalance
      state.ethBalance = load.ethBalance || state.ethBalance
      break
    case k.TOGGLE_ANALYTICS_PERMISSION:
      state.analyticsPermission = load.analyticsPermission
      break
    default:
      return state
  }
  return state
}