'use strict'

const {
  DOWNLOAD_COMPLETE,
  LOGIN,
  LOGIN_DEV,
  PUBLISHED,
  UPLOAD_COMPLETE
 } = require('../../../lib/constants/stateManagement')

module.exports = async (state, { load, type }) => {
  switch (type) {
    case LOGIN:
      state.aid = load[0]
      break
    case LOGIN_DEV:
      state.aid = load.account
      state.aid.password = load.password
      state.aid.accountAddress = load.accountAddress
      state.araBalance = load.araBalance
      break
    case PUBLISHED:
      state.userBalance = load
      break
    default:
    return state
  }
  return state
}