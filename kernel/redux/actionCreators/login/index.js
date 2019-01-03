'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:login')
const araUtil = require('ara-util')
const aid = require('ara-identity')
const {
  afmManager,
  afsManager,
  acmManager,
  farmerManager,
  identityManager,
  utils,
  descriptorGeneration
} = require('../../actions')
const dispatch = require('../../reducers/dispatch')
const helpers = require('./helpers')
const { stateManagement: k } = require('k')
const windowManager = require('electron-window-manager')
const { ipcMain } = require('electron')
const { internalEmitter } = require('electron-window-manager')
const { switchLoginState } = require('../../../../boot/tray')
const { switchApplicationMenuLoginState } = require('../../../../boot/menu')
const store = windowManager.sharedData.fetch('store')

internalEmitter.on(k.LOGOUT, () => {
  dispatch({ type: k.FEED_MODAL, load: { modalName: 'logoutConfirm', callback: logout } })
  windowManager.openModal('generalActionModal')
})

internalEmitter.on(k.GET_CACHED_DID, async () => {
  const did = await afmManager.getCachedUserDid()
  dispatch({ type: k.GOT_CACHED_DID, load: { did } })
  windowManager.pingView({ view: 'login', event: k.REFRESH })
})

ipcMain.on(k.LOGIN, login)

ipcMain.on(k.RECOVER, async (event, load) => {
  debug('%s heard', k.RECOVER)
  try {
    windowManager.pingView({ view: 'recover', event: k.RECOVERING })

    const identity = await identityManager.recover(load)
    await identityManager.archive(identity)

    const { did } = identity.did
    login(null, { userDID: did, password: load.password })

    windowManager.pingView({ view: 'recover', event: k.RECOVERED })
  } catch (err) {
    const dispatchLoad = {
      modalName: 'recoveryFailure',
      callback: () => windowManager.pingView({ view: 'recover', event: k.RECOVER_FAILED })
    }
    dispatch({ type: k.FEED_MODAL, load: dispatchLoad })
    windowManager.openModal('generalMessageModal')
  }
})

async function logout() {
  try {
    await farmerManager.stopAllBroadcast(store.farmer.farm)
    dispatch({ type: k.LOGOUT })
    internalEmitter.emit(k.DUMP_DEEPLINK_DATA)
    internalEmitter.emit(k.CANCEL_SUBSCRIPTION)
    switchLoginState(false)
    switchApplicationMenuLoginState(false)
    //TODO: make closeAll function
    windowManager.closeWindow('filemanager')
    windowManager.closeWindow('publishFileView')
    windowManager.closeWindow('accountInfo')
    windowManager.openWindow('login')
  } catch (err) {
    debug('Error logging out: %o', o)
  }
}

async function login(_, load) {
  debug('%s heard', k.LOGIN)
  try {
    const ddo = await aid.resolve(load.userDID)
    const incorrectPW = !(await araUtil.isCorrectPassword({ ddo, password: load.password }))
    if (incorrectPW) { throw 'IncorrectPW' }
  } catch (err) {
    debug('Login error: %o', err)
    dispatch({ type: k.FEED_MODAL, load: { modalName: 'loginFail', callback: () => windowManager.openWindow('login') } })
    windowManager.openModal('generalMessageModal')
    return
  }

  const userDID = araUtil.getIdentifier(load.userDID)
  //writes did signed in with to disk to autofill input next time app booted
  afmManager.cacheUserDid(userDID)

  try {
    const network = await utils.getNetwork()
    dispatch({ type: k.GETTING_USER_DATA, load: { userDID, network } })
    windowManager.openWindow('filemanager')

    const analyticsPermission = afmManager.getAnalyticsPermission(userDID)
    const accountAddress = await acmManager.getAccountAddress(userDID, load.password)
    const araBalance = await acmManager.getAraBalance(userDID)
    const ethBalance = await acmManager.getEtherBalance(accountAddress)
    const autoQueue = farmerManager.createAutoQueue()
    const farmer = farmerManager.createFarmer({ did: userDID, password: load.password, queue: autoQueue })
    //Creates a dummy afs used to estimate deployment costs more quickly
    const deployEstimateDid = await afsManager.createDeployEstimateAfs(userDID, load.password)
    dispatch({
      type: k.LOGIN,
      load: {
        analyticsPermission,
        accountAddress,
        araBalance,
        autoQueue,
        deployEstimateDid,
        ethBalance,
        farmer,
        password: load.password,
        userDID
      }
    })

    windowManager.pingView({ view: 'filemanager', event: k.REFRESH })

    switchLoginState(true)
    switchApplicationMenuLoginState(true)

    const DCDNStore = farmerManager.loadDCDNStore(farmer)
    const purchasedDIDs = await acmManager.getLibraryItems(userDID)
    //Returns objects representing various info around DIDs
    let purchased = purchasedDIDs.map(descriptorGeneration.makeDummyDescriptor)

    const publishedDIDs = (await acmManager.getDeployedProxies(accountAddress)).map(araUtil.getIdentifier)
    let published = publishedDIDs.map(descriptorGeneration.makeDummyDescriptor)

    let { files } = dispatch({ type: k.GOT_LIBRARY, load: { published, purchased } })
    windowManager.pingView({ view: 'filemanager', event: k.REFRESH })

    const allAFS = files.published.concat(files.purchased)

    //Gets earnings from purchases for published AFS and pupdates ui
    await Promise.all(files.published.map(helpers.getPublishedEarnings))
    //Gets metadata for all AFS and pupdates ui
    await Promise.all(allAFS.map(helpers.readMeta))

    //Returns objects with more detailed info around DIDs
    published = await afsManager.surfaceAFS({
      dids: publishedDIDs,
      userDID,
      published: true,
      DCDNStore
    })

    purchased = await afsManager.surfaceAFS({
      dids: purchasedDIDs,
      userDID,
      DCDNStore
    });

    ({ files } = dispatch({ type: k.GOT_LIBRARY, load: { published, purchased } }))
    windowManager.pingView({ view: 'filemanager', event: k.REFRESH })

    //TODO: refactor to loop through only once
    //Gets redeemable rewards for published and purchased items
    let updatedPublishedItems = await Promise.all(files.published.map((item) =>
      acmManager.getAllocatedRewards(item, userDID, load.password)))
    let updatedPurchasedItems = await Promise.all(files.purchased.map((item) =>
      acmManager.getAllocatedRewards(item, userDID, load.password)))
    updatedPublishedItems = await Promise.all(updatedPublishedItems.map((item) =>
      //Gets total redeemed rewards for published and purchased items
      acmManager.getRewards(item, accountAddress)))
    updatedPurchasedItems = await Promise.all(updatedPurchasedItems.map((item) =>
      acmManager.getRewards(item, accountAddress)))
    //Gets update available status for purchased items
    updatedPurchasedItems = await Promise.all(updatedPurchasedItems.map(afsManager.getUpdateAvailableStatus));

    ({ files } = dispatch({
      type: k.LOADED_BACKGROUND_AFS_DATA,
      load: { published: updatedPublishedItems, purchased: updatedPurchasedItems }
    }))
    //Refreshes filemanager view and renders items
    windowManager.pingView({ view: 'filemanager', event: k.REFRESH })

    //Creates subscriptions in background
    const transferSub = await acmManager.subscribeTransfer(accountAddress, userDID)
    const transferEthSub = await acmManager.subscribeEthBalance(accountAddress)
    const publishedSubs = await Promise.all(files.published.map(acmManager.subscribePublished))
    const rewardsSubs = await Promise.all(files.published.concat(files.purchased)
      .map(({ did }) => acmManager.subscribeRewardsAllocated(did, accountAddress, userDID)))
    const updateSubs = await Promise.all(files.purchased.map(({ did }) => acmManager.subscribeAFSUpdates(did)))

    dispatch({
      type: k.GOT_SUBSCRIPTIONS,
      load: {
        publishedSubs,
        rewardsSubs,
        transferSub,
        transferEthSub,
        updateSubs
      }
    })

    if (store.files.deepLinkData !== null) {
      internalEmitter.emit(k.PROMPT_PURCHASE, store.files.deepLinkData)
    }

    farmer.start()

    debug('Login complete')
  } catch (err) {
    debug('Error: %O', err)
  }
}

