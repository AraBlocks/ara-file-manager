'use strict'

const k = require('../../../lib/constants/stateManagement')

module.exports = async (state, { load = null, type }) => {
  switch (type) {
    case k.GETTING_USER_DATA:
      state.username = 'Logging in'
      state.araBalance = 0
      break
    case k.LOGIN:
      state.userAid = load.userAid
      state.password = load.password
      state.accountAddress = load.accountAddress
      state.araBalance = load.araBalance
      state.username = 'Test User'
      break
    case k.LOGOUT:
      Object.keys(state).forEach(key => state[key] = null)
      break
    case k.PUBLISHED:
      state.userBalance = load.balance
      break
    case k.UPDATE_BALANCE:
    case k.PURCHASED:
      state.araBalance = load.araBalance
      break
    default:
      return state
  }
  return state
}