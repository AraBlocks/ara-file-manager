'use strict'

const debug = require('debug')('acms:account')
const {
  DOWNLOAD_COMPLETE,
  LOGIN,
  LOGIN_DEV,
  PUBLISHED,
  UPLOAD_COMPLETE
 } = require('../../../lib/constants/stateManagement')
const araContractsManager = require('../actions/araContractsManager')

module.exports = async (state, { load, type }) => {
  debug('Old state: %O', state)
  switch (type) {
    case LOGIN:
      state.aid = load[0]
      break
    case LOGIN_DEV:
      state.aid = load.account
      state.aid.password = load.password
      state.aid.accountAddress = load.accountAddress
      state.userBalance = await araContractsManager.getUserBalance(state.aid.accountAddress)
      break
    case PUBLISHED:
      state.userBalance = await araContractsManager.getUserBalance(state.aid.accountAddress)
      break
    case UPLOAD_COMPLETE:
      state.userBalance = await araContractsManager.getUserBalance(state.aid.accountAddress)
      break
    case DOWNLOAD_COMPLETE:
      state.userBalance = await araContractsManager.getUserBalance(state.aid.accountAddress)
      break
    default:
    return state
  }
  debug('New state: %O', state)
  return state
}