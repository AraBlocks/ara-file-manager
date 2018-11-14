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

    debug('DISPATCHING %s', k.REDEEM_REWARDS)
    dispatch({ type: k.REDEEMING_REWARDS, load: { did: load.did } })
    windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
    const value = await rewards.redeem({
      farmerDid: account.userAid,
      password: account.password,
      contentDid: load.did
    })

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

