'use strict'

const debug = require('debug')('afm:kernel:lib:actionCreators:register')
const { stateManagement: k } = require('k')
const acmManager = require('../actions/acmManager')
const dispatch = require('../reducers/dispatch')
const {
  identityManager,
  afsManager,
  afmManager,
  farmerManager,
  utils: actionUtils
 } = require('../actions')
const { switchLoginState } = require('../../../boot/tray')
const { switchApplicationMenuLoginState } = require('../../../boot/menu')
const araUtil = require('ara-util')
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
    const accountAddress = await acmManager.getAccountAddress(did, password)

    const deployEstimateDid = await afsManager.createDeployEstimateAfs(did, password)

    const network = await actionUtils.getNetwork()
    const autoQueue = farmerManager.createAutoQueue()
    const farmer = farmerManager.createFarmer({ did, password, queue: autoQueue })
    const didIdentifier = araUtil.getIdentifier(did)
    afmManager.cacheUserDid(didIdentifier)
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
        userDID: didIdentifier
      }
    })
    switchLoginState(true)
    switchApplicationMenuLoginState(true)

    windowManager.pingView({ view: 'registration', event: k.REGISTERED })

    internalEmitter.emit(k.LOGIN, {
      userDID: did,
      password
    })

    const transfer = await acmManager.subscribeTransfer(accountAddress, did)
    const transferEth = await acmManager.subscribeEthBalance(accountAddress)
    const subscriptionLoad = { transferEth, transfer }

    try {
      await actionUtils.requestAraFaucet(did)
      subscriptionLoad.faucet = await acmManager.subscribeFaucet(accountAddress)
    } catch (err) {
      debug('Error requesting from ara faucet: %o', err)
    }

    try {
      await actionUtils.requestEthFaucet(accountAddress)
    } catch (err) {
      debug('Error requesting from eth faucet: %s', err.message)
    }

    dispatch({ type: k.GOT_REGISTRATION_SUBS, load: subscriptionLoad })
    farmer.start()
  } catch (err) {
    debug('Error registering: %o', err)
  }
})