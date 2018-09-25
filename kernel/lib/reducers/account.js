'use strict'

const {
  GETTING_USER_DATA,
  LOGIN,
  LOGIN_DEV,
  LOGOUT,
  PUBLISHED,
  UPDATE_BALANCE
 } = require('../../../lib/constants/stateManagement')

module.exports = async (state, { load = null, type }) => {
  switch (type) {
    case GETTING_USER_DATA:
      state.username = 'Logging in'
      state.araBalance = 0
      break
    case LOGIN:
      state.aid = load[0]
      break
    case LOGIN_DEV:
      state.userAid = load.userAid
      state.password = load.password
      state.accountAddress = load.accountAddress
      state.araBalance = load.araBalance
      state.username = 'cryptokitter'
      break
    case LOGOUT:
      Object.keys(state).forEach(key => state[key] = null)
      break
    case PUBLISHED:
      state.userBalance = load
      break
    case UPDATE_BALANCE:
      state.araBalance = load
    default:
    return state
  }
  return state
}