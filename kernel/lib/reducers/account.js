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
      state.aid.accountAddress = await araContractsManager.getAccountAddress(load.account.ddo.id, load.password)
      state.userBalance = await araContractsManager.getUserBalance(state.aid.accountAddress)
      await araContractsManager.purchaseItem({ requesterDid: 'ab10d1792f80143bb466597bafe5c71119845f88ee3d27f89944c1969579452d', password: 'abc', contentDid: '532569b8f83957f6dbdab12f49fc196f804c9dd361e61a8ea97a3d5105b32437' })
      await araContractsManager.getLibraryItems(state.aid.ddo.id)
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