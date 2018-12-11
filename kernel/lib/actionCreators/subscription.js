'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:wallet')
const { araContractsManager } = require('../actions')
const dispatch = require('../reducers/dispatch')
const k = require('../../../lib/constants/stateManagement')
const { FAUCET_URI } = require('../../../lib/constants/networkKeys')
const { ipcMain } = require('electron')
const request = require('request-promise')
const windowManager = require('electron-window-manager')
const { internalEmitter } = windowManager
const store = windowManager.sharedData.fetch('store')

internalEmitter.on(k.UPDATE_EARNING, (load) => {
  debug('%s HEARD', k.UPDATE_EARNING)
  try {
    dispatch({ type: k.UPDATE_EARNING, load })
    windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
  } catch (err) {
    debug('Error: %o', err)
  }
})

internalEmitter.on(k.UPDATE_BALANCE, (load) => {
  try {
    dispatch({ type: k.UPDATE_BALANCE, load })
    windowManager.pingAll({ event: k.REFRESH })
  } catch (err) {
    debug('Error: %o', err)
  }
})

ipcMain.on(k.LISTEN_FOR_FAUCET, async (event, load) => {
  debug('%s HEARD', k.LISTEN_FOR_FAUCET)
  try {
    dispatch({ type: k.IN_FAUCET_QUEUE })
    windowManager.pingView({ view: 'accountInfo', event: k.REFRESH })

    const response = await request.post({
      method: 'POST',
      uri: FAUCET_URI,
      body: { to: store.account.userAid },
      json: true
    })

    let dispatchLoad
    if (response.status === 'Queued') {
      debug('IN FAUCET QUEUE')
      const faucetSub = await araContractsManager.subscribeFaucet(store.account.accountAddress)
      dispatchLoad = { type: k.GOT_FAUCET_SUB, load: { faucetSub }}
    } else if (response.error.includes('greylisted')) {
      debug('GREY LISTED FROM FAUCET 🙀')
      dispatchLoad = { type: k.GREYLISTED_FROM_FAUCET }
    } else {
      debug('REACHED FAUCET LIMIT')
      dispatchLoad = { type: k.FAUCET_LIMIT_HIT }
    }

    dispatch(dispatchLoad)
  } catch (err) {
    debug('Err requesting from faucet %o', err)
    dispatch({ type: k.FAUCET_ERROR })
  }

  windowManager.pingView({ view: 'accountInfo', event: k.REFRESH })
})

internalEmitter.on(k.FAUCET_ARA_RECEIVED, () => {
  try {
    debug('%s HEARD', k.FAUCET_ARA_RECEIVED)
    store.subscriptions.faucet.ctx.close()
    dispatch({ type: k.FAUCET_ARA_RECEIVED })

    windowManager.pingView({ view: 'accountInfo', event: k.REFRESH })
  } catch (e) { debug(e) }

})

internalEmitter.on(k.CANCEL_SUBSCRIPTION, () => {
  try {
    debug('%s HEARD', k.CANCEL_SUBSCRIPTION)
    store.subscriptions.transfer.ctx.close()
    store.subscriptions.transferEth.ctx.close()
    store.subscriptions.published.forEach(subscription => subscription.ctx.close())
    store.subscriptions.rewards.forEach(subscription => subscription.ctx.close())
    dispatch({ type: k.CANCEL_SUBSCRIPTION })
  } catch(err) {
    debug('Error closing subscription ctx %o', err)
  }
})