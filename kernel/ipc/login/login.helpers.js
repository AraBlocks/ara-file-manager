const { events } = require('k')
const fs = require('fs')
const windowManager = require('electron-window-manager')

const menuHelper = require('../../../boot/menuHelper')
const { AutoQueue } = require('../../lib')
const dispatch = require('../../redux/reducers/dispatch')
const {
  act,
  afs,
  afm,
  rewardsDCDN,
  utils
} = require('../../daemons')

const store = windowManager.sharedData.fetch('store')

async function getInitialAccountState(userDID, password) {
  const network = await utils.getNetwork()
  dispatch({ type: events.GETTING_USER_DATA, load: { userDID, network } })
  windowManager.openWindow('filemanager')

  const accountAddress = await act.getAccountAddress(userDID, password)
  const autoQueue = new AutoQueue
  const farmer = rewardsDCDN.createFarmer({ did: userDID, password: password, queue: autoQueue })
  dispatch({
    type: events.LOGIN,
    load: {
      accountAddress,
      autoQueue,
      userDID,
      farmer,
      password,
      analyticsPermission: afm.getAnalyticsPermission(userDID),
      araBalance: await act.getAraBalance(userDID),
      deployEstimateDid: await afs.createDeployEstimateAfs(userDID, password),
      ethBalance: await act.getEtherBalance(accountAddress)
    }
  })

  menuHelper.switchLoginState(events.LOADING_LIBRARY)
  windowManager.pingView({ view: 'filemanager', event: events.REFRESH })
  return { accountAddress, farmer }
}

//Creates subscriptions to blockchain events
async function getSubscriptions(purchasedAFS, allAFS, credentials) {
  const { userDID, accountAddress } = credentials

  const subscriptionsLoad = {}
  subscriptionsLoad.transferSub = await act.subscribeTransfer(accountAddress, userDID)
  subscriptionsLoad.transferEthSub = await act.subscribeEthBalance(accountAddress)
  subscriptionsLoad.publishedSubs = await Promise.all(allAFS.map(act.subscribePublished))
  subscriptionsLoad.rewardsSubs = await Promise.all(allAFS
    .map(({ did }) => act.subscribeRewardsAllocated(did, accountAddress, userDID)))
  subscriptionsLoad.updateSubs = await Promise.all(purchasedAFS.map(({ did }) => act.subscribeAFSUpdates(did)))

  dispatch({ type: events.GOT_SUBSCRIPTIONS, load: subscriptionsLoad })
}

async function populateUI(publishedAFS, purchasedAFS, credentials) {
  const { userDID, accountAddress, password } = credentials
  const allAFS = publishedAFS.concat(purchasedAFS)

  await Promise.all(publishedAFS.map(_getCommitStatus))
  windowManager.pingView({ view: 'filemanager', event: events.REFRESH })
  Promise.all(_getDownloadPercAndStatus(store.files.published.concat(store.files.purchased)))
    .then(async () => {
      windowManager.pingView({ view: 'filemanager', event: events.REFRESH })
      //Inside `then` cb bc it relies on `downloadPercent` a value derived from `getDownloadPercAndStatus`
      await Promise.all(store.files.purchased.map(_getUpdateAvailable))
      windowManager.pingView({ view: 'filemanager', event: events.REFRESH })
    })

  await Promise.all(allAFS.map(_readMeta))
  windowManager.pingView({ view: 'filemanager', event: events.REFRESH })

  await Promise.all(allAFS.map(_getPrice))
  windowManager.pingView({ view: 'filemanager', event: events.REFRESH })

  await Promise.all(publishedAFS.map(_getPublishedEarnings))
  await Promise.all(allAFS.map(({ did }) => _getSeedEarnings(did, accountAddress)))
  windowManager.pingView({ view: 'filemanager', event: events.REFRESH })

  await Promise.all(allAFS.map(({ did }) => _getAllocatedRewards(did, userDID, password)))
  windowManager.pingView({ view: 'filemanager', event: events.REFRESH })
}

//Gets allocated rewards for AFS
async function _getAllocatedRewards(did, userDID, password) {
  const allocatedRewards = await act.getAllocatedRewards(did, userDID, password)
  dispatch({ type: events.GOT_REWARDS, load: { did, allocatedRewards } })
}

//Check if published AFS are committed
async function _getCommitStatus({ did, status }) {
  status = await afs.isCommitted(did) ? status : events.UNCOMMITTED
  dispatch({ type: events.GOT_COMMIT_STATUS, load: { did, status } })
}

//Gets the download percent and descriptor status of each AFS
function _getDownloadPercAndStatus(files) {
  return files.map(async (file) => {
    const load = file.status === events.UNCOMMITTED
      ? file
      : await afs.getAfsDownloadStatus(file.did, file.shouldBroadcast)
    dispatch({ type: events.GOT_DL_PERC_AND_STATUS, load: { did: file.did, ...load } })
  })
}

//Gets earnings from purchases for published AFS
async function _getPublishedEarnings({ did }) {
  const earnings = await act.getEarnings(did)
  dispatch({ type: events.GOT_EARNING, load: { did, earnings } })
}

//Get price for all AFS
async function _getPrice({ did }) {
  const price = await act.getAFSPrice({ did })
  dispatch({ type: events.GOT_PRICE, load: { did, price } })
}

//Gets earnings from seeding for all AFS
async function _getSeedEarnings(did, ethAddress) {
  const earnings = await act.getRewards(did, ethAddress)
  dispatch({ type: events.GOT_EARNING, load: { did, earnings } })
}

//Gets update avail status of purchased AFS
async function _getUpdateAvailable({ did, downloadPercent }) {
  const updateAvailable = await afs.isUpdateAvailable(did, downloadPercent)
  updateAvailable && dispatch({ type: events.UPDATE_AVAILABLE, load: { did } })
}

//Gets metadata for all AFS
async function _readMeta({ did }) {
  const AFSPath = utils.makeAfsPath(did)
  const AFSExists = fs.existsSync(AFSPath)
  if (AFSExists) {
    const meta = await utils.readFileMetadata(did)
    dispatch({ type: events.GOT_META, load: { did, meta } })
  }
}

module.exports = {
  getInitialAccountState,
  getSubscriptions,
  populateUI
}