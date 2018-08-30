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

<<<<<<< HEAD
module.exports = (state, { load, type }) => {
  debug('Old state: %O', state)
=======
module.exports = async (state, { load, type }) => {
>>>>>>> cache
  switch (type) {
    case LOGIN:
      state.aid = load[0]
      break
    case LOGIN_DEV:
      state.aid = load.account
      state.aid.password = load.password
      state.aid.accountAddress = await araContractsManager.getAccountAddress(load.account.ddo.id, load.password)
      break
      case PUBLISHED:
      //state.userBalance = await araContractsManager.getUserBalance(state.aid.accountAddress)
      console.log(state.userBalance)
      break
    case UPLOAD_COMPLETE:
      state.userBalance = state.userBalance + Number(load)
      break
    case DOWNLOAD_COMPLETE:
      state.userBalance = state.userBalance - Number(load)
      break
    default:
    return state
  }
  debug('New state: %O', state)
  return state
}