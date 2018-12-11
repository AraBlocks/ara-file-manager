'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:wallet')
const dispatch = require('../reducers/dispatch')
const k = require('../../../lib/constants/stateManagement')
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

internalEmitter.on(k.UPDATE_ARA_BALANCE, (load) => {
  try {
    dispatch({ type: k.UPDATE_ARA_BALANCE, load })
    windowManager.pingAll({ event: k.REFRESH })
  } catch (err) {
    debug('Error: %o', err)
  }
})

internalEmitter.on(k.UPDATE_ETH_BALANCE, (load) => {
  const { account } = store
  try {
    if (account.ethBalance !== load.ethBalance) {
      dispatch({ type: k.UPDATE_ARA_BALANCE, load })
      windowManager.pingAll({ event: k.REFRESH })
    }
  } catch (err) {
    debug('Error: %o', err)
  }
})

internalEmitter.on(k.FAUCET_ARA_RECEIVED, () => {
  try {
    debug('%s HEARD', k.FAUCET_ARA_RECEIVED)
    store.subscriptions.faucet.ctx.close()
    dispatch({ type: k.FAUCET_ARA_RECEIVED })

    windowManager.pingView({ view: 'accountInfo', event: k.REFRESH })
  } catch (err) {
    debug('Err on faucet received listener: %o', err)
  }
})