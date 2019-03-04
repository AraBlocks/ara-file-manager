const debug = require('debug')('afm:kernel:lib:actionCreators:rewards')

const { events } = require('k')
const { rewards } = require('ara-contracts')
const { ipcMain } = require('electron')
const windowManager = require('electron-window-manager')

const dispatch = require('../reducers/dispatch')

const store = windowManager.sharedData.fetch('store')
const { internalEmitter } = windowManager

ipcMain.on(events.REDEEM_REWARDS, async (_, load) => {
  debug('%s HEARD', events.REDEEM_REWARDS)

  const { account } = store
  const { did } = load
  try {
    dispatch({ type: events.FEED_ESTIMATE_SPINNER, load: { did, type: 'redeem' } })
    windowManager.openWindow('estimateSpinner')

    const estimate = await rewards.redeem({
      farmerDid: account.userDID,
      password: account.password,
      contentDid: did,
      estimate: true
    })

    windowManager.pingView({ view: 'estimateSpinner', event: events.REFRESH, load: { estimate } })
  } catch (err) {
    debug('Error redeeming rewards: %o', err)
  }
})

ipcMain.on(events.CONFIRM_REDEEM, async (_, load) => {
  debug('%s HEARD', events.CONFIRM_REDEEM)
  try {
    const { account, account: { autoQueue } } = store

    debug('DISPATCHING %s', events.REDEEMING_REWARDS)
    dispatch({ type: events.REDEEMING_REWARDS, load: { did: load.did } })
    windowManager.pingView({ view: 'filemanager', event: events.REFRESH })

    const redeemLoad = {
      farmerDid: account.userDID,
      password: account.password,
      contentDid: load.did
    }
    const value = await autoQueue.push(() => rewards.redeem(redeemLoad))

    debug('DISPATCHING %s', events.REWARDS_REDEEMED)
    dispatch({ type: events.REWARDS_REDEEMED, load: { did: load.did, value } })
    windowManager.pingView({ view: 'filemanager', event: events.REFRESH })
  } catch (err) {
    debug('Error redeeming rewards: %o', err)
  }
})

internalEmitter.on(events.REWARDS_ALLOCATED, (load) => {
  debug('%s HEARD', events.REWARDS_ALLOCATED)
  try {
    dispatch({ type: events.REWARDS_ALLOCATED, load })
    windowManager.pingView({ view: 'filemanager', event: events.REFRESH })
  } catch (err) {
    debug('Error: %o', o)
  }
})

