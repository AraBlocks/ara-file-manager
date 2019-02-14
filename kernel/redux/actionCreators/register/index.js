const debug = require('debug')('afm:kernel:lib:actionCreators:register')

const {
  application: applicationK,
  stateManagement: k
} = require('k')
const araUtil = require('ara-util')
const { ipcMain } = require('electron')
const windowManager = require('electron-window-manager')

const acmManager = require('../../actions/acmManager')
const {
  afsManager,
  afmManager,
  identityManager,
  farmerManager,
  utils: actionUtils
} = require('../../actions')
const { AutoQueue } = require('../../../lib')
const dispatch = require('../../reducers/dispatch')
const helpers = require('./register.helpers')
const menuHelper = require('../../../../boot/menuHelper')

ipcMain.on(k.CREATE_USER_DID, async () => {
  debug('%s heard. load: %s', k.CREATE_USER_DID)
  try {
    // windowManager.pingView({ view: 'registration', event: k.REGISTERING })
    const identity = await identityManager.create(applicationK.DEFAULT_PASSWORD)
    identityManager.archive(identity)

    const { did: { did }, mnemonic } = identity
    const accountAddress = await acmManager.getAccountAddress(did, applicationK.DEFAULT_PASSWORD)

    helpers.requestEther(accountAddress)

    //need to move to update pw listener with updated pw
    // const deployEstimateDid = await afsManager.createDeployEstimateAfs(did, applicationK.DEFAULT_PASSWORD)

    const network = await actionUtils.getNetwork()
    //need to move to update pw listener with updated pw
    // const autoQueue = new AutoQueue
    // const farmer = farmerManager.createFarmer({
    //   did,
    //   password: applicationK.DEFAULT_PASSWORD,
    //   queue: autoQueue
    // })
    const didIdentifier = araUtil.getIdentifier(did)
    afmManager.cacheUserDid(didIdentifier)
    const analyticsPermission = afmManager.getAnalyticsPermission(did)

    dispatch({
      type: k.CREATED_USER_DID,
      load: {
        accountAddress,
        analyticsPermission,
        araBalance: 0,
        // autoQueue,
        // deployEstimateDid,
        ethBalance: 0,
        // farmer,
        mnemonic,
        network,
        password: applicationK.DEFAULT_PASSWORD,
        userDID: didIdentifier
      }
    })
    //move to updatePW
    // menuHelper.switchLoginState(k.LOGIN)

    windowManager.pingView({
      view: 'registration',
      event: k.CREATED_USER_DID,
      load: { userDID: didIdentifier }
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


    dispatch({ type: k.GOT_REGISTRATION_SUBS, load: subscriptionLoad })
    //move to updatePW
    // farmer.start()
  } catch (err) {
    debug('Error registering: %o', err)
    dispatch({ type: k.FEED_MODAL, load: { modalName: 'registrationFailed' } })
    windowManager.openModal('generalMessageModal')
    windowManager.closeWindow('registration')
  }
})