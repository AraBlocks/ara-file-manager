const debug = require('debug')('ara:fm:kernel:ipc:register')

const { application, events } = require('k')
const araUtil = require('ara-util')
const windowManager = require('electron-window-manager')

const { AutoQueue } = require('../../lib')
const {
  act,
  afs,
  utils: actionUtils,
  afm,
  aid,
  rewardsDCDN,
} = require('../../daemons')
const dispatch = require('../../redux/reducers/dispatch')
const menuHelper = require('../../../boot/menuHelper')
const { internalEmitter } = require('electron-window-manager')

const store = windowManager.sharedData.fetch('store')

async function _createIdentity() {
  const identity = await aid.create(application.TEMP_PASSWORD)
  const { did: { did }, mnemonic } = identity
  await aid.archive(identity)
  const accountAddress = await act.getAccountAddress(did, application.TEMP_PASSWORD)
  const network = await actionUtils.getNetwork()
  const userDID = araUtil.getIdentifier(did)
  const analyticsPermission = afm.getAnalyticsPermission(did)
  _requestEther(accountAddress)
  return {
    accountAddress,
    analyticsPermission,
    userDID,
    username: userDID.slice(0, 8),
    mnemonic,
    network,
    password: application.TEMP_PASSWORD
  }
}

async function getAccountsProps({ password, userDID }) {
  const deployEstimateDid = await afs.createDeployEstimateAfs(userDID, password)
  const autoQueue = new AutoQueue
  const farmer = rewardsDCDN.createFarmer({
    did: userDID,
    password,
    queue: autoQueue
  })
  farmer.start()
  menuHelper.switchLoginState(events.LOGIN)
  return { autoQueue, deployEstimateDid, farmer }
}

async function getSubscriptions({ accountAddress, userDID }) {
  const transfer = await act.subscribeTransfer(accountAddress, userDID)
  const transferEth = await act.subscribeEthBalance(accountAddress)
  let faucet = {}
  try {
    await actionUtils.requestAraFaucet(userDID)
    faucet = await act.subscribeFaucet(accountAddress)
  } catch (err) {
    debug('Error requesting from ara faucet: %o', err)
  }
  return { faucet, transfer, transferEth }
}

async function _requestEther(ethAddress) {
  try {
    debug('Requesting from main eth faucet')
    await actionUtils.requestEthFaucet(ethAddress)
  } catch (err) {
    debug('Error requesting from main eth faucet: %s', err.message)
    try {
      debug('Requesting from fallback eth faucet')
      await actionUtils.requestFallbackEthFaucet(ethAddress)
    } catch (err) {
      debug('Error requesting from fallback eth faucet: %s', err.message)
    }
  }
}

async function pushAID(_, load) {
  debug('%s heard', events.CREATE_USER_DID)
  const logout = load ? load.logout : false
  try {
    const identityProps = await _createIdentity()
    windowManager.pingView({
      view: 'registration',
      event: events.CREATED_USER_DID,
      load: {
        identityProps,
        userDID: identityProps.userDID,
        mnemonic: identityProps.mnemonic
      }
    })
  } catch (err) {
    debug('Error creating identity: %o', err)
    dispatch({ type: events.FEED_MODAL, load: { modalName: 'registrationFailed' } })
    windowManager.openModal('generalMessageModal')
    windowManager.closeWindow('registration')
  }
}

module.exports = {
  getSubscriptions,
  getAccountsProps,
  pushAID
}
