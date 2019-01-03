'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:wallet')
const { acmManager, utils: actionUtils } = require('../actions')
const dispatch = require('../reducers/dispatch')
const k = require('../../../lib/constants/stateManagement')
const { ipcMain } = require('electron')
const windowManager = require('electron-window-manager')
const { internalEmitter } = windowManager
const store = windowManager.sharedData.fetch('store')

ipcMain.on(k.LISTEN_FOR_FAUCET, async (event, load) => {
  debug('%s HEARD', k.LISTEN_FOR_FAUCET)
  try {
    dispatch({ type: k.IN_FAUCET_QUEUE })
    windowManager.pingView({ view: 'accountInfo', event: k.REFRESH })

    const response = await actionUtils.requestAraFaucet(store.account.userDID)

    let dispatchLoad
    if (response.status === 'Queued') {
      debug('IN FAUCET QUEUE')
      const faucetSub = await acmManager.subscribeFaucet(store.account.accountAddress)
      dispatchLoad = { type: k.GOT_FAUCET_SUB, load: { faucetSub } }
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


internalEmitter.on(k.CANCEL_SUBSCRIPTION, () => {
  try {
    debug('%s HEARD', k.CANCEL_SUBSCRIPTION)
    Object.values(store.subscriptions).forEach(closeCTX)
    dispatch({ type: k.CANCEL_SUBSCRIPTION })
  } catch (err) {
    debug('Error closing subscription ctx %o', err)
  }
})

function closeCTX(subscription) {
  subscription
    ? Array.isArray(subscription)
      ? subscription.forEach(closeCTX)
      : subscription.ctx.close()
    : null
}