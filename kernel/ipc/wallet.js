const debug = require('debug')('ara:fm:kernel:ipc:wallet')

const dispatch = require('../redux/reducers/dispatch')
const { events } = require('k')
const windowManager = require('electron-window-manager')

const { internalEmitter } = windowManager
const store = windowManager.sharedData.fetch('store')

internalEmitter.on(events.UPDATE_EARNING, (load) => {
  debug('%s HEARD', events.UPDATE_EARNING)
  try {
    dispatch({ type: events.UPDATE_EARNING, load })
    windowManager.pingView({ view: 'filemanager', event: events.REFRESH })
  } catch (err) {
    debug('Error: %o', err)
  }
})

internalEmitter.on(events.UPDATE_ARA_BALANCE, (load) => {
  try {
    dispatch({ type: events.UPDATE_ARA_BALANCE, load })
    windowManager.pingAll({ event: events.REFRESH })
  } catch (err) {
    debug('Error: %o', err)
  }
})

internalEmitter.on(events.UPDATE_ETH_BALANCE, (load) => {
  const { account } = store
  try {
    if (account.ethBalance !== load.ethBalance) {
      dispatch({ type: events.UPDATE_ETH_BALANCE, load })
      windowManager.pingView({ view: 'accountInfo', event: events.REFRESH })
    }
  } catch (err) {
    debug('Error: %o', err)
  }
})

internalEmitter.on(events.FAUCET_ARA_RECEIVED, () => {
  try {
    debug('%s HEARD', events.FAUCET_ARA_RECEIVED)
    store.subscriptions.faucet.ctx.close()
    dispatch({ type: events.FAUCET_ARA_RECEIVED })

    windowManager.pingAll({ event: events.REFRESH })
  } catch (err) {
    debug('Err on faucet received listener: %o', err)
  }
})