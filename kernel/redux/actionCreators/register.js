'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:register')
const { stateManagement: k } = require('k')
const araContractsManager = require('../actions/araContractsManager')
const dispatch = require('../reducers/dispatch')
const {
  identityManager,
  afsManager,
  afmManager,
  farmerManager,
  utils: araUtils
 } = require('../actions')
const { switchLoginState } = require('../../../boot/tray')
const { switchApplicationMenuLoginState } = require('../../../boot/menu')
const windowManager = require('electron-window-manager')
const { ipcMain } = require('electron')
const { internalEmitter } = require('electron-window-manager')

ipcMain.on(k.REGISTER, async (event, password) => {
  debug('%s heard. load: %s', k.REGISTER, password)
  try {
    windowManager.pingView({ view: 'registration', event: k.REGISTERING })

    const identity = await identityManager.create(password)
    await identityManager.archive(identity)

    const { did: { did }, mnemonic } = identity
    const accountAddress = await araContractsManager.getAccountAddress(did, password)

    const deployEstimateDid = await afsManager.createDeployEstimateAfs(did, password)

    const network = await araUtils.getNetwork()
    const autoQueue = farmerManager.createAutoQueue()
    const farmer = farmerManager.createFarmer({ did, password, queue: autoQueue })
    afmManager.cacheUserDid(did)
    const analyticsPermission = afmManager.getAnalyticsPermission(did)
    debug('Dispatching %s', k.REGISTERED)
    dispatch({
      type: k.REGISTERED,
      load: {
        accountAddress,
        analyticsPermission,
        araBalance: 0,
        autoQueue,
        deployEstimateDid,
        ethBalance: 0,
        farmer,
        mnemonic,
        network,
        password,
        userAid: did
      }
    })
    switchLoginState(true)
    switchApplicationMenuLoginState(true)

    windowManager.pingView({ view: 'registration', event: k.REGISTERED })

    internalEmitter.emit(k.LOGIN, {
      userAid: did,
      password
    })

    const transfer = await araContractsManager.subscribeTransfer(accountAddress, did)
    const transferEth = await araContractsManager.subscribeEthBalance(accountAddress)
    const subscriptionLoad = { transferEth, transfer }

    try {
      await araUtils.requestFromFaucet(did)
      subscriptionLoad.faucet = await araContractsManager.subscribeFaucet(accountAddress)
    } catch (err) {
      debug('Error requesting faucet: %o', err)
    }

    dispatch({ type: k.GOT_REGISTRATION_SUBS, load: subscriptionLoad })
    farmer.start()
  } catch (err) {
    debug('Error registering: %o', err)
  }
})