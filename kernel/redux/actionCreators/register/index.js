'use strict'

const debug = require('debug')('afm:kernel:lib:actionCreators:register')
const { stateManagement: k } = require('k')
const acmManager = require('../../actions/acmManager')
const { AutoQueue } = require('../../../lib')
const dispatch = require('../../reducers/dispatch')
const {
  identityManager,
  afsManager,
  afmManager,
  farmerManager,
  utils: actionUtils
 } = require('../../actions')
const helpers = require('./register.helpers')
const { switchLoginState } = require('../../../../boot/tray')
const { switchApplicationMenuLoginState } = require('../../../../boot/menu')
const araUtil = require('ara-util')
const windowManager = require('electron-window-manager')
const { ipcMain } = require('electron')
const { internalEmitter } = require('electron-window-manager')

ipcMain.on(k.REGISTER, async (_, password) => {
  debug('%s heard. load: %s', k.REGISTER, password)
  try {
    windowManager.pingView({ view: 'registration', event: k.REGISTERING })
    const identity = await identityManager.create(password)
    await identityManager.archive(identity)

    const { did: { did }, mnemonic } = identity
    const accountAddress = await acmManager.getAccountAddress(did, password)

    helpers.requestEther(accountAddress)

    const deployEstimateDid = await afsManager.createDeployEstimateAfs(did, password)

    const network = await actionUtils.getNetwork()
    const autoQueue = new AutoQueue
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

    switchLoginState(k.LOGIN)
    switchApplicationMenuLoginState(k.LOGIN)

    windowManager.pingView({ view: 'registration', event: k.REGISTERED })

    const transfer = await acmManager.subscribeTransfer(accountAddress, did)
    const transferEth = await acmManager.subscribeEthBalance(accountAddress)
    const subscriptionLoad = { transferEth, transfer }

    try {
      await actionUtils.requestAraFaucet(did)
      subscriptionLoad.faucet = await acmManager.subscribeFaucet(accountAddress)
    } catch (err) {
      debug('Error requesting from ara faucet: %o', err)
    }

    dispatch({ type: k.GOT_REGISTRATION_SUBS, load: subscriptionLoad })

    farmer.start()
  } catch (err) {
    debug('Error registering: %o', err)
    dispatch({ type: k.FEED_MODAL, load: { modalName: 'registrationFailed' } })
    windowManager.openModal('generalMessageModal')
    windowManager.closeWindow('registration')
  }
})