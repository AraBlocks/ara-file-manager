'use strict'

const {
  GETTING_USER_DATA,
  LOGIN,
  LOGOUT,
  PUBLISHED,
  PURCHASED,
  UPDATE_BALANCE
 } = require('../../../lib/constants/stateManagement')

module.exports = async (state, { load = null, type }) => {
  switch (type) {
    case GETTING_USER_DATA:
      state.username = 'Logging in'
      state.araBalance = 0
      break
    case LOGIN:
      state.userAid = load.userAid
      state.password = load.password
      state.accountAddress = load.accountAddress
      state.araBalance = load.araBalance
      state.username = 'Test User'
      break
    case LOGOUT:
      Object.keys(state).forEach(key => state[key] = null)
      break
    case PUBLISHED:
      state.userBalance = load
      break
    case UPDATE_BALANCE:
    case PURCHASED:
      state.araBalance = load
      break
    default:
    return state
  }
  return state
}