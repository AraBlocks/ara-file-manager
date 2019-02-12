'use strict'

const { stateManagement: k } = require('k')
const menuHelper = require('../../../../boot/menuHelper')
const { AutoQueue } = require('../../../lib')
const dispatch = require('../../reducers/dispatch')
const {
  acmManager,
  afsManager,
  afmManager,
  farmerManager,
  utils
} = require('../../actions')
const fs = require('fs')
const windowManager = require('electron-window-manager')
const store = windowManager.sharedData.fetch('store')

async function getInitialAccountState(userDID, password) {
  const network = await utils.getNetwork()
  dispatch({ type: k.GETTING_USER_DATA, load: { userDID, network } })
  windowManager.openWindow('filemanager')

  const accountAddress = await acmManager.getAccountAddress(userDID, password)
  const autoQueue = new AutoQueue
  const farmer = farmerManager.createFarmer({ did: userDID, password: password, queue: autoQueue })
  dispatch({
    type: k.LOGIN,
    load: {
      accountAddress,
      autoQueue,
      userDID,
      farmer,
      password,
      analyticsPermission: afmManager.getAnalyticsPermission(userDID),
      araBalance: await acmManager.getAraBalance(userDID),
      deployEstimateDid: await afsManager.createDeployEstimateAfs(userDID, password),
      ethBalance: await acmManager.getEtherBalance(accountAddress)
    }
  })

  menuHelper.switchLoginState(k.LOADING_LIBRARY)
  windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
  return { accountAddress, farmer }
}

//Creates subscriptions to blockchain events
async function getSubscriptions(purchasedAFS, allAFS, credentials) {
  const { userDID, accountAddress } = credentials

  const subscriptionsLoad = {}
  subscriptionsLoad.transferSub = await acmManager.subscribeTransfer(accountAddress, userDID)
  subscriptionsLoad.transferEthSub = await acmManager.subscribeEthBalance(accountAddress)
  subscriptionsLoad.publishedSubs = await Promise.all(allAFS.map(acmManager.subscribePublished))
  subscriptionsLoad.rewardsSubs = await Promise.all(allAFS
    .map(({ did }) => acmManager.subscribeRewardsAllocated(did, accountAddress, userDID)))
  subscriptionsLoad.updateSubs = await Promise.all(purchasedAFS.map(({ did }) => acmManager.subscribeAFSUpdates(did)))

  dispatch({ type: k.GOT_SUBSCRIPTIONS, load: subscriptionsLoad })
}

async function populateUI(publishedAFS, purchasedAFS, credentials) {
  const { userDID, accountAddress, password } = credentials
  const allAFS = publishedAFS.concat(purchasedAFS)

  await Promise.all(publishedAFS.map(_getCommitStatus))
  windowManager.pingView({ view: 'filemanager', event: k.REFRESH })

  Promise.all(_getDownloadPercAndStatus(store.files.published.concat(store.files.purchased)))
    .then(async () => {
      windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
      //Inside `then` cb bc it relies on `downloadPercent` a value derived from `getDownloadPercAndStatus`
      await Promise.all(store.files.purchased.map(_getUpdateAvailable))
      windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
    })

  await Promise.all(allAFS.map(_readMeta))
  windowManager.pingView({ view: 'filemanager', event: k.REFRESH })

  await Promise.all(allAFS.map(_getPrice))
  windowManager.pingView({ view: 'filemanager', event: k.REFRESH })

  await Promise.all(publishedAFS.map(_getPublishedEarnings))
  await Promise.all(allAFS.map(({ did }) => _getSeedEarnings(did, accountAddress)))
  windowManager.pingView({ view: 'filemanager', event: k.REFRESH })

  await Promise.all(allAFS.map(({ did }) => _getAllocatedRewards(did, userDID, password)))
  windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
}

//Gets allocated rewards for AFS
async function _getAllocatedRewards(did, userDID, password) {
  const allocatedRewards = await acmManager.getAllocatedRewards(did, userDID, password)
  dispatch({ type: k.GOT_REWARDS, load: { did, allocatedRewards } })
}

//Check if published AFS are committed
async function _getCommitStatus({ did, status }) {
  status = await afsManager.isCommitted(did) ? status : k.UNCOMMITTED
  dispatch({ type: k.GOT_COMMIT_STATUS, load: { did, status } })
}

//Gets the download percent and descriptor status of each AFS
function _getDownloadPercAndStatus(files) {
  return files.map(async (file) => {
    const load = file.status === k.UNCOMMITTED
      ? file
      : await afsManager.getAfsDownloadStatus(file.did, file.shouldBroadcast)
    dispatch({ type: k.GOT_DL_PERC_AND_STATUS, load: { did: file.did, ...load } })
  })
}

//Gets earnings from purchases for published AFS
async function _getPublishedEarnings({ did }) {
  const earnings = await acmManager.getEarnings(did)
  dispatch({ type: k.GOT_EARNING, load: { did, earnings } })
}

//Get price for all AFS
async function _getPrice({ did }) {
  const price = await acmManager.getAFSPrice({ did })
  dispatch({ type: k.GOT_PRICE, load: { did, price } })
}

//Gets earnings from seeding for all AFS
async function _getSeedEarnings(did, ethAddress) {
  const earnings = await acmManager.getRewards(did, ethAddress)
  dispatch({ type: k.GOT_EARNING, load: { did, earnings } })
}

//Gets update avail status of purchased AFS
async function _getUpdateAvailable({ did, downloadPercent }) {
  const updateAvailable = await afsManager.isUpdateAvailable(did, downloadPercent)
  updateAvailable && dispatch({ type: k.UPDATE_AVAILABLE, load: { did } })
}

//Gets metadata for all AFS
async function _readMeta({ did }) {
  const AFSPath = utils.makeAfsPath(did)
  const AFSExists = fs.existsSync(AFSPath)
  if (AFSExists) {
    const meta = await utils.readFileMetadata({ did })
    dispatch({ type: k.GOT_META, load: { did, meta } })
  }
}

module.exports = {
  getInitialAccountState,
  getSubscriptions,
  populateUI
}