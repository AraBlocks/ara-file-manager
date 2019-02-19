const debug = require('debug')('ara:fm:kernel:ipc:register:registerhelpers')
const { utils } = require('../../daemons')

const {
  application: applicationK,
  stateManagement: k
} = require('k')
const araUtil = require('ara-util')

const { AutoQueue } = require('../../../lib')
const {
  acmManager,
  afsManager,
  utils: actionUtils,
  afmManager,
  identityManager,
  farmerManager,
  utils
} = require('../../actions')
const menuHelper = require('../../../../boot/menuHelper')

async function createIdentity() {
  const identity = await identityManager.create(applicationK.TEMP_PASSWORD)
  const { did: { did }, mnemonic } = identity
  await identityManager.archive(identity)
  const accountAddress = await acmManager.getAccountAddress(did, applicationK.TEMP_PASSWORD)
  const network = await actionUtils.getNetwork()
  const userDID = araUtil.getIdentifier(did)
  const analyticsPermission = afmManager.getAnalyticsPermission(did)
  _requestEther(accountAddress)
  afmManager.cacheUserDid(userDID)
  return {
    accountAddress,
    analyticsPermission,
    userDID,
    mnemonic,
    network,
    password: applicationK.TEMP_PASSWORD
  }
}

async function getAccountsProps({ password, userDID }) {
  const deployEstimateDid = await afsManager.createDeployEstimateAfs(userDID, password)
  const autoQueue = new AutoQueue
  const farmer = farmerManager.createFarmer({
    did: userDID,
    password,
    queue: autoQueue
  })
  farmer.start()
  menuHelper.switchLoginState(k.LOGIN)
  return { autoQueue, deployEstimateDid, farmer }
}

async function getSubscriptions({ accountAddress, userDID }) {
  const transfer = await acmManager.subscribeTransfer(accountAddress, userDID)
  const transferEth = await acmManager.subscribeEthBalance(accountAddress)
  let faucet = {}
  try {
    await actionUtils.requestAraFaucet(userDID)
    faucet = await acmManager.subscribeFaucet(accountAddress)
  } catch (err) {
    debug('Error requesting from ara faucet: %o', err)
  }
  return { faucet, transfer, transferEth }
}

async function _requestEther(ethAddress) {
  try {
    debug('Requesting from main eth faucet')
    await utils.requestEthFaucet(ethAddress)
  } catch (err) {
    debug('Error requesting from main eth faucet: %s', err.message)
    try {
      debug('Requesting from fallback eth faucet')
      await utils.requestFallbackEthFaucet(ethAddress)
    } catch (err) {
      debug('Error requesting from fallback eth faucet: %s', err.message)
    }
  }
}

module.exports = {
  createIdentity,
  getAccountsProps,
  getSubscriptions
  requestEther
}
