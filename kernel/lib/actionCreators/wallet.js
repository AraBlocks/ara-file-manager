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
  debug('%s HEARD', k.UPDATE_BALANCE)
  try {
    dispatch({ type: k.UPDATE_BALANCE, load })
    windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
    windowManager.pingView({ view: 'accountInfo', event: k.REFRESH })
  } catch (err) {
    debug('Error: %o', err)
  }
})

ipcMain.on(k.LISTEN_FOR_FAUCET, async (event, load) => {
  debug('%s HEARD', k.LISTEN_FOR_FAUCET)
  try {
    dispatch({ type: k.IN_FAUCET_QUEUE })
    windowManager.pingView({ view: 'accountInfo', event: k.REFRESH })

    const res = await request.post({
      method: 'POST',
      uri: FAUCET_URI,
      body: { to: store.account.userAid },
      json: true
    })
    console.log(res)

    debug('IN FAUCET QUEUE')
    const faucetSub = await araContractsManager.subscribeFaucet(store.account.accountAddress)
    dispatch({ type: k.GOT_FAUCET_SUB, load: { faucetSub }})

    windowManager.pingView({ view: 'accountInfo', event: k.REFRESH })
  } catch (err) {
    debug('Err requesting from faucet')
    if (err.message.includes('greylisted')) {
      debug('GREY LISTED FROM FAUCET 🙀')
      dispatch({ type: k.GREYLISTED_FROM_FAUCET })
      windowManager.pingView({ view: 'accountInfo', event: k.REFRESH })
    } else if(err.message.includes('Balance must be')) {
      debug('REACHED FAUCET LIMIT')
      dispatch({ type: k.REACHED_FAUCET_LIMIT })
      windowManager.pingView({ view: 'accountInfo', event: k.REFRESH })
    }
  }
})

internalEmitter.on(k.FAUCET_ARA_RECEIVED, () => {
  try {
    debug('%s HEARD', k.FAUCET_ARA_RECEIVED)
    store.subscriptions.faucet.ctx.close()
    dispatch({ type: k.FAUCET_ARA_RECEIVED })

    windowManager.pingView({ view: 'accountInfo', event: k.REFRESH })
  } catch (e) { console.log(e) }

})