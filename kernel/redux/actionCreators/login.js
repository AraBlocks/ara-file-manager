'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:login')
const araUtil = require('ara-util')
const aid = require('ara-identity')
const {
  afmManager,
  afsManager,
  araContractsManager,
  farmerManager,
  identityManager,
  utils
} = require('../actions')
const dispatch = require('../reducers/dispatch')
const { stateManagement: k } = require('k')
const windowManager = require('electron-window-manager')
const { ipcMain } = require('electron')
const { internalEmitter } = require('electron-window-manager')
const { switchLoginState } = require('../../../boot/tray')
const { switchApplicationMenuLoginState } = require('../../../boot/menu')
const store = windowManager.sharedData.fetch('store')

internalEmitter.on(k.LOGOUT, () => {
  dispatch({ type: k.FEED_MODAL, load: { modalName: 'logoutConfirm', callback: logout } })
  windowManager.openModal('generalActionModal')
})

ipcMain.on(k.LOGIN, login)

ipcMain.on(k.RECOVER, async (event, load) => {
  debug('%s heard', k.RECOVER)
  try {
    windowManager.pingView({ view: 'recover', event: k.RECOVERING })

    const identity = await identityManager.recover(load)
    await identityManager.archive(identity)

    const { did: { did } } = identity
    login(null, { userAid: did, password: load.password })

    windowManager.pingView({ view: 'recover', event: k.RECOVERED })
  } catch (err) {
    const dispatchLoad = {
      modalName: 'recoveryFailure',
      callback: () => windowManager.pingView({ view: 'recover', event: k.RECOVER_FAILED})
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
    const ddo = await aid.resolve(load.userAid)
    const incorrectPW = !(await araUtil.isCorrectPassword({ ddo, password: load.password }))
    if (incorrectPW) { throw 'IncorrectPW' }
  } catch (err) {
    debug('Login error: %o', err)
    dispatch({ type: k.FEED_MODAL, load: { modalName: 'loginFail', callback: () => windowManager.openWindow('login') } })
    windowManager.openModal('generalMessageModal')
    return
  }

  //writes did signed in with to disk to autofill input next time app booted
  afmManager.cacheUserDid(load.userAid)

  try {
    const network = await utils.getNetwork()
    dispatch({ type: k.GETTING_USER_DATA, load: { userAid: load.userAid, network } })
    windowManager.openWindow('filemanager')

    const accountAddress = await araContractsManager.getAccountAddress(load.userAid, load.password)
    const araBalance = await araContractsManager.getAraBalance(load.userAid)
    const ethBalance = await araContractsManager.getEtherBalance(accountAddress)
    const farmer = farmerManager.createFarmer({ did: load.userAid, password: load.password })
    //Creates a dummy afs used to estimate deployment costs more quickly
    const deployEstimateDid = await afsManager.createDeployEstimateAfs(load.userAid, load.password)
    dispatch({
      type: k.LOGIN,
      load: {
        accountAddress,
        araBalance,
        deployEstimateDid,
        ethBalance,
        farmer,
        password: load.password,
        userAid: load.userAid
      }
    })

    windowManager.pingView({ view: 'filemanager', event: k.REFRESH })

    switchLoginState(true)
    switchApplicationMenuLoginState(true)
    const DCDNStore = farmerManager.loadDCDNStore(farmer)
    const purchasedDIDs = await araContractsManager.getLibraryItems(load.userAid)
    //Returns objects representing various info around purchased DIDs
    const purchased = await afsManager.surfaceAFS({
      dids: purchasedDIDs,
      userDID: load.userAid,
      DCDNStore
    })
    const publishedDIDs = await afmManager.getPublishedItems(load.userAid)
    //Returns objects representing various info around published DIDs
    const published = await afsManager.surfaceAFS({
      dids: publishedDIDs,
      userDID: load.userAid,
      published: true,
      DCDNStore
    })

    let files;
    ({ files } = dispatch({ type: k.GOT_LIBRARY, load: { published, purchased } }))

    let updatedPublishedItems = await araContractsManager.getPublishedEarnings(files.published)
    updatedPublishedItems = await Promise.all(updatedPublishedItems.map((item) =>
      araContractsManager.getAllocatedRewards(item, load.userAid, load.password)))
    let updatedPurchasedItems = await Promise.all(files.purchased.map((item) =>
      araContractsManager.getAllocatedRewards(item, load.userAid, load.password)))
    updatedPublishedItems = await Promise.all(updatedPublishedItems.map((item) =>
      araContractsManager.getRewards(item, accountAddress)))
    updatedPurchasedItems = await Promise.all(updatedPurchasedItems.map((item) =>
      araContractsManager.getRewards(item, accountAddress)))
    updatedPurchasedItems = await Promise.all(updatedPurchasedItems.map(afsManager.getUpdateAvailableStatus));

    ({ files } = dispatch({
      type: k.LOADED_BACKGROUND_AFS_DATA,
      load: { published: updatedPublishedItems, purchased: updatedPurchasedItems }
    }))

    windowManager.pingView({ view: 'filemanager', event: k.REFRESH })

    const transferSub = await araContractsManager.subscribeTransfer(accountAddress, load.userAid)
    const transferEthSub = await araContractsManager.subscribeEthBalance(accountAddress)
    const publishedSubs = await Promise.all(files.published.map(araContractsManager.subscribePublished))
    const rewardsSubs = await Promise.all(files.published.concat(files.purchased)
      .map(({ did }) => araContractsManager.subscribeRewardsAllocated(did, accountAddress, load.userAid)))

    dispatch({
      type: k.GOT_SUBSCRIPTIONS,
      load: {
        publishedSubs,
        rewardsSubs,
        transferSub,
        transferEthSub
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