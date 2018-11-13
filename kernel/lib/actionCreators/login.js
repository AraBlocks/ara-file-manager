'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:login')
const araUtil = require('ara-util')
const aid = require('ara-identity')
const {
  acmManager,
  afsManager,
  araContractsManager,
  farmerManager,
  identityManager
} = require('../actions')
const dispatch = require('../reducers/dispatch')
const k = require('../../../lib/constants/stateManagement')
const windowManager = require('electron-window-manager')
const { ipcMain } = require('electron')
const { internalEmitter } = require('electron-window-manager')
const { switchLoginState } = require('../../../boot/tray')
const store = windowManager.sharedData.fetch('store')

internalEmitter.on(k.LOGOUT, () => {
  farmerManager.stopAllBroadcast(store.farmer.farm)
  dispatch({ type: k.LOGOUT })
  switchLoginState(false)
  windowManager.closeWindow('filemanager')
  windowManager.closeWindow('publishFileView')
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
    debug('Error recovering acct: %o', err)
  }
})

async function login(_, load) {
  debug('%s heard', k.LOGIN)
  try {
    const ddo = await aid.resolve(load.userAid)
    const incorrectPW = !(await araUtil.isCorrectPassword({ ddo, password: load.password }))
    if (incorrectPW) { throw 'IncorrectPW' }
  } catch (err) {
    debug('Login error: %o', err)
    dispatch({ type: k.FEED_MODAL, load: { modalName: 'loginFail' } })
    internalEmitter.emit(k.OPEN_MODAL, 'generalMessageModal')
    return
  }

  try {
    dispatch({ type: k.GETTING_USER_DATA, load: { userAid: load.userAid } })
    windowManager.openWindow('filemanager')

    const accountAddress = await araContractsManager.getAccountAddress(load.userAid, load.password)
    const araBalance = await araContractsManager.getAraBalance(load.userAid)
    const transferSubscription = araContractsManager.subscribeTransfer(accountAddress)
    const farmer = farmerManager.createFarmer({ did: load.userAid, password: load.password })
    farmer.start()

    dispatch({
      type: k.LOGIN,
      load: {
        userAid: load.userAid,
        accountAddress,
        araBalance,
        password: load.password,
        transferSubscription,
        farmer
      }
    })

    switchLoginState(true)
    const DCDNStore = farmerManager.loadDCDNStore(farmer)
    const purchasedDIDs = await araContractsManager.getLibraryItems(load.userAid)
    const purchased = await afsManager.surfaceAFS({
      dids: purchasedDIDs,
      userDID: load.userAid,
      DCDNStore
    })
    const publishedDIDs = await acmManager.getPublishedItems(load.userAid)
    const published = await afsManager.surfaceAFS({
      dids: publishedDIDs,
      userDID: load.userAid,
      published: true,
      DCDNStore
    })
    let files;
    ({ files } = dispatch({ type: k.GOT_LIBRARY, load: { published, purchased } }))
    windowManager.pingView({ view: 'filemanager', event: k.REFRESH })

    let updatedPublishedItems = await araContractsManager.getPublishedEarnings(files.published)
    updatedPublishedItems = await Promise.all(files.published.map((item) =>
      araContractsManager.getAllocatedRewards(item, load.userAid, load.password)))
    const updatedPurchasedItems = await Promise.all(files.purchased.map((item) =>
      araContractsManager.getAllocatedRewards(item, load.userAid, load.password)));

    ({ files } = dispatch({
      type: k.GOT_EARNINGS_AND_REWARDS,
      load: { published: updatedPublishedItems, purchased: updatedPurchasedItems }
    }))
    windowManager.pingView({ view: 'filemanager', event: k.REFRESH })

    const subscriptions = await Promise.all(files.published.map(araContractsManager.subscribePublished))
    await Promise.all(files.published.map(({ did }) =>
      araContractsManager.subscribeRewardsAllocated(did, load.userAid)))

    dispatch({ type: k.GOT_PUBLISHED_SUBS, load: subscriptions })

    debug('Login complete')
  } catch (err) {
    debug('Error: %O', err)
  }
}