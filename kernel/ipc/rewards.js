const debug = require('debug')('ara:fm:kernel:ipc:rewards')

const { events } = require('k')
const { rewards } = require('ara-contracts')
const { ipcMain } = require('electron')
const windowManager = require('electron-window-manager')

const { utils } = require('../daemons')
const dispatch = require('../redux/reducers/dispatch')

const store = windowManager.sharedData.fetch('store')
const { internalEmitter } = windowManager

const GAS_TIMEOUT = 10000

let errored = false
let redeemed = false

ipcMain.on(events.REDEEM_REWARDS, async (_, load) => {
  debug('%s HEARD', events.REDEEM_REWARDS)
  try {
    errored = false
    redeemed = false
    dispatch({ type: events.FEED_MODAL, load: { modalName: 'suggestingGasPrices' } })
    windowManager.openModal('generalPleaseWaitModal')

    const gasPrice = await utils.requestGasPrice()
    const { average, fast, fastest } = gasPrice
    dispatch({ type: events.REDEEM_FILE_LOAD, load: { did: load.did } })
    dispatch({ type: events.SET_GAS_PRICE, load: { average: Number(average)/10, fast: Number(fast)/10, fastest: Number(fastest)/10, step: 'redeem' } })

    windowManager.closeModal('generalPleaseWaitModal')
    windowManager.openModal('setGasModal')
  } catch (err) {
    debug('Error for %s: %o', 'newestimate', err)
    windowManager.closeModal('generalPleaseWaitModal')
    windowManager.closeModal('setGasModal')
  }
})

internalEmitter.on(events.REDEEM_NEW_GAS, async (_, { step }) => {
  await _onNewGas(step)
})

ipcMain.on(events.REDEEM_NEW_GAS, async (_, { step }) => {
  await _onNewGas(step)
})

async function _onNewGas(step) {
  debug('%s HEARD', events.REDEEM_NEW_GAS)
  dispatch({ type: events.FEED_MODAL, load: { modalName: 'suggestingGasPrices' } })
  windowManager.openModal('generalPleaseWaitModal')
  const gasPrice = await utils.requestGasPrice()
  const { average, fast, fastest } = gasPrice
  dispatch({ type: events.SET_GAS_PRICE, load: { average: Number(average)/10, fast: Number(fast)/10, fastest: Number(fastest)/10, step } })
  windowManager.closeModal('generalPleaseWaitModal')
  windowManager.openModal('setGasModal')
}

ipcMain.on(events.GAS_PRICE, async (_, load) => {
  load = Object.assign(load, store.modal.redeemFileData)
  const { did, step, gasPrice } = load
  if (!step.includes('redeem'))
    return

  const { account } = store
  try {
    dispatch({ type: events.FEED_ESTIMATE_SPINNER, load: { did, type: 'redeem', gasPrice } })
    windowManager.openWindow('estimateSpinner')

    const estimate = await rewards.redeem({
      farmerDid: account.userDID,
      password: account.password,
      contentDid: did,
      estimate: true,
      gasPrice
    })

    windowManager.pingView({ view: 'estimateSpinner', event: events.REFRESH, load: { estimate } })
  } catch (err) {
    debug('Error redeeming rewards: %o', err)
  }
})

ipcMain.on(events.CONFIRM_REDEEM, async (_, load) => {
  debug('%s HEARD', events.CONFIRM_REDEEM, load)
  try {
    const { account, account: { autoQueue } } = store

    debug('DISPATCHING %s', events.REDEEMING_REWARDS)
    dispatch({ type: events.REDEEMING_REWARDS, load: { did: load.did } })
    windowManager.pingView({ view: 'filemanager', event: events.REFRESH })

    this.startTimer = (progressStep) => {
      setTimeout(
        () => {
          let trigger = !(redeemed || errored)
          debug('timeout', trigger)
          if (trigger) {
            dispatch({ type: events.ONE_STEP_PROGRESS, load: { step: progressStep } })
            windowManager.pingView({ view: 'oneStepProgressModal', event: events.REFRESH })
          }
        }, GAS_TIMEOUT
      )
    }

    let value
    autoQueue.clear()
    this.startTimer('retryredeem')
    await new Promise(async (resolve, reject) => {
      [value] = await autoQueue.push(() => rewards.redeem({
        farmerDid: account.userDID,
        password: account.password,
        contentDid: load.did,
        gasPrice: load.gasPrice,
        onhash: hash => {
          debug('redeem tx hash: %s', hash)
          dispatch({
            type: events.ONE_STEP_PROGRESS,
            load: {
              modalName: 'Redeeming',
              hash,
              network: store.application.network,
              retryEvent: events.REDEEM_NEW_GAS,
              stepName: 'Redeeming'
            }})
          windowManager.openModal('oneStepProgressModal')
        },
        onreceipt: receipt => {
          debug('redeem tx receipt:', receipt)
          redeemed = true
          windowManager.closeModal('oneStepProgressModal')
          resolve()
        },
        onerror: error => {
          debug('redeem tx error:', error)
          errored = true
          windowManager.closeModal('oneStepProgressModal')
          reject()
        }
      }))
    })

    if (redeemed) {
      debug('DISPATCHING %s', events.REWARDS_REDEEMED)
      dispatch({ type: events.REWARDS_REDEEMED, load: { did: load.did, value } })
      windowManager.pingView({ view: 'filemanager', event: events.REFRESH })
    }
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

