'use strict'

const {
  DOWNLOAD_COMPLETE,
  LOGIN,
  LOGIN_DEV,
  PUBLISHED,
  UPLOAD_COMPLETE
 } = require('../../../lib/constants/stateManagement')

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
    case UPLOAD_COMPLETE:
      state.userBalance = state.userBalance + Number(load)
      state.userBalance
      break
    case DOWNLOAD_COMPLETE:
      state.userBalance = state.userBalance - Number(load)
      break
    default:
      return state
  }
  return state
}