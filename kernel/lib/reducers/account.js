'use strict'

const {
  LOGIN,
  LOGIN_DEV,
  LOGOUT,
  PUBLISHED,
  UPDATE_BALANCE
 } = require('../../../lib/constants/stateManagement')

module.exports = async (state, { load, type }) => {
  switch (type) {
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
      state.userAid = null,
      state.password = null,
      state.accountAddress = null,
      state.araBalance = 0,
      state.etherBalance = 0,
      state.username = 'Not Logged In'
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