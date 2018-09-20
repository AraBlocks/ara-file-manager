'use strict'

const {
  LOGIN,
  LOGIN_DEV,
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