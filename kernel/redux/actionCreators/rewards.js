'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:rewards')
const k = require('../../../lib/constants/stateManagement')
const dispatch = require('../reducers/dispatch')
const { rewards } = require('ara-contracts')
const { ipcMain } = require('electron')
const windowManager = require('electron-window-manager')
const { internalEmitter } = windowManager
const store = windowManager.sharedData.fetch('store')

ipcMain.on(k.REDEEM_REWARDS, async (event, load) => {
  debug('%s HEARD', k.REDEEM_REWARDS)
  try {
    const { account } = store
    const estimate = await rewards.redeem({
      farmerDid: account.userDID,
      password: account.password,
      contentDid: load.did,
      estimate: true
    })

    dispatch({ type: k.FEED_MODAL, load: { estimate, did: load.did } })
    windowManager.openModal('redeemConfirmModal')
  } catch (err) {
    debug('Error redeeming rewards: %o', err)
  }
})

ipcMain.on(k.CONFIRM_REDEEM, async (event, load) => {
  debug('%s HEARD', k.CONFIRM_REDEEM)
  try {
    const { account, account: { autoQueue } } = store

    internalEmitter.emit(k.CHANGE_PENDING_TRANSACTION_STATE, true)
    debug('DISPATCHING %s', k.REDEEMING_REWARDS)
    dispatch({ type: k.REDEEMING_REWARDS, load: { did: load.did } })
    windowManager.pingView({ view: 'filemanager', event: k.REFRESH })

    const redeemLoad = { farmerDid: account.userDID, password: account.password, contentDid: load.did }
    const value = await autoQueue.push(() => rewards.redeem(redeemLoad))

    debug('DISPATCHING %s', k.REWARDS_REDEEMED)
    internalEmitter.emit(k.CHANGE_PENDING_TRANSACTION_STATE, false)
    dispatch({ type: k.REWARDS_REDEEMED, load: { did: load.did, value } })
    windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
  } catch (err) {
    debug('Error redeeming rewards: %o', err)
  }
})

internalEmitter.on(k.REWARDS_ALLOCATED, (load) => {
  debug('%s HEARD', k.REWARDS_ALLOCATED)
  try {
    dispatch({ type: k.REWARDS_ALLOCATED, load })
    internalEmitter.emit(k.CHANGE_PENDING_TRANSACTION_STATE, false)
    windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
  } catch (err) {
    debug('Error: %o', o)
  }
})

