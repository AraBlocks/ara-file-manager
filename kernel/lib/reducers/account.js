'use strict'

const { LOGIN, LOGIN_DEV, PUBLISHED } = require('../../../lib/constants/stateManagement')

module.exports = (state, { load, type }) => {
  switch (type) {
    case LOGIN:
      state.aid = load[0]
      break
    case LOGIN_DEV:
      state.aid = load.account
      state.aid.password = load.password
      break
      case PUBLISHED:
      state.userBalance = state.userBalance - load
      break
    default:
      return state
  }
  return state
}