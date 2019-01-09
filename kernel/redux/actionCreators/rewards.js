'use strict'

const debug = require('debug')('afm:kernel:lib:actionCreators:rewards')
const { stateManagement: k } = require('k')
const dispatch = require('../reducers/dispatch')
const { rewards } = require('ara-contracts')
const { ipcMain } = require('electron')
const windowManager = require('electron-window-manager')
const { internalEmitter } = windowManager
const store = windowManager.sharedData.fetch('store')

ipcMain.on(k.REDEEM_REWARDS, async (_, load) => {
  debug('%s HEARD', k.REDEEM_REWARDS)

  const { account } = store
  const { did } = load
  try {
    dispatch({ type: k.FEED_ESTIMATE_SPINNER, load: { did, type: 'redeem' } })
    windowManager.openWindow('estimateSpinner')

    const estimate = await rewards.redeem({
      farmerDid: account.userDID,
      password: account.password,
      contentDid: did,
      estimate: true
    })

    windowManager.pingView({ view: 'estimateSpinner', event: k.REFRESH, load: { estimate } })
  } catch (err) {
    debug('Error redeeming rewards: %o', err)
  }
})

ipcMain.on(k.CONFIRM_REDEEM, async (_, load) => {
  debug('%s HEARD', k.CONFIRM_REDEEM)
  try {
    const { account, account: { autoQueue } } = store

    debug('DISPATCHING %s', k.REDEEMING_REWARDS)
    dispatch({ type: k.REDEEMING_REWARDS, load: { did: load.did } })
    windowManager.pingView({ view: 'filemanager', event: k.REFRESH })

    const redeemLoad = {
      farmerDid: account.userDID,
      password: account.password,
      contentDid: load.did
    }
    const value = await autoQueue.push(() => rewards.redeem(redeemLoad))

    debug('DISPATCHING %s', k.REWARDS_REDEEMED)
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
    windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
  } catch (err) {
    debug('Error: %o', o)
  }
})

