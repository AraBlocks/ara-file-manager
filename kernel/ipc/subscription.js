const debug = require('debug')('afm:kernel:ipc:wallet')

const { events } = require('k')
const { ipcMain } = require('electron')
const windowManager = require('electron-window-manager')

const { act, utils: actionUtils } = require('../daemons')
const dispatch = require('../redux/reducers/dispatch')

const { internalEmitter } = windowManager
const store = windowManager.sharedData.fetch('store')

ipcMain.on(events.LISTEN_FOR_FAUCET, async () => {
  debug('%s HEARD', events.LISTEN_FOR_FAUCET)
  try {
    dispatch({ type: events.IN_FAUCET_QUEUE })
    windowManager.pingView({ view: 'accountInfo', event: events.REFRESH })

    const response = await actionUtils.requestAraFaucet(store.account.userDID)

    let dispatchLoad
    if (response.status === 'Queued') {
      debug('IN FAUCET QUEUE')
      const faucetSub = await act.subscribeFaucet(store.account.accountAddress)
      dispatchLoad = { type: events.GOT_FAUCET_SUB, load: { faucetSub } }
    } else if (response.error.includes('greylisted')) {
      debug('GREY LISTED FROM FAUCET 🙀')
      dispatchLoad = { type: events.GREYLISTED_FROM_FAUCET }
    } else {
      debug('REACHED FAUCET LIMIT')
      dispatchLoad = { type: events.FAUCET_LIMIT_HIT }
    }

    dispatch(dispatchLoad)
  } catch (err) {
    debug('Err requesting from faucet %o', err)
    dispatch({ type: events.FAUCET_ERROR })
  }

  windowManager.pingView({ view: 'accountInfo', event: events.REFRESH })
})
internalEmitter.on(events.CANCEL_SUBSCRIPTION, () => {
  try {
    debug('%s HEARD', events.CANCEL_SUBSCRIPTION)
    Object.values(store.subscriptions).forEach(closeCTX)
    dispatch({ type: events.CANCEL_SUBSCRIPTION })
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