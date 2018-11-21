'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:login')
const araUtil = require('ara-util')
const aid = require('ara-identity')
const {
  acmManager,
  afsManager,
  araContractsManager,
  farmerManager,
  identityManager,
  utils
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
  windowManager.openWindow('login')
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
    windowManager.openModal('generalMessageModal')
    return
  }

  try {
    dispatch({ type: k.GETTING_USER_DATA, load: { userAid: load.userAid } })
    windowManager.openWindow('filemanager')

    const accountAddress = await araContractsManager.getAccountAddress(load.userAid, load.password)
    const araBalance = await araContractsManager.getAraBalance(load.userAid)
    const ethBalance = await araContractsManager.getEtherBalance(accountAddress)
    const transferSubscription = await araContractsManager.subscribeTransfer(accountAddress)

    const farmer = farmerManager.createFarmer({ did: load.userAid, password: load.password })
    farmer.start()

    dispatch({
      type: k.LOGIN,
      load: {
        accountAddress,
        araBalance,
        ethBalance,
        farmer,
        password: load.password,
        transferSubscription,
        userAid: load.userAid
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
    let updatedPurchasedItems = await Promise.all(files.purchased.map((item) =>
      araContractsManager.getAllocatedRewards(item, load.userAid, load.password)))
    updatedPublishedItems = await Promise.all(files.published.map((item) =>
      araContractsManager.getRewards(item, accountAddress)))
    updatedPurchasedItems = await Promise.all(files.purchased.map((item) =>
      araContractsManager.getRewards(item, accountAddress)))

    ;({ files } = dispatch({
      type: k.GOT_EARNINGS_AND_REWARDS,
      load: { published: updatedPublishedItems, purchased: updatedPurchasedItems }
    }))

    const network = await utils.getNetwork()
    dispatch({ type: k.GOT_NETWORK, load: { network } })

    windowManager.pingView({ view: 'filemanager', event: k.REFRESH })

    const publishedSubs = await Promise.all(files.published.map(araContractsManager.subscribePublished))
    const rewardsSubs = await Promise.all(files.published.concat(files.purchased)
      .map(({ did }) => araContractsManager.subscribeRewardsAllocated(did, accountAddress, load.userAid)))

    dispatch({ type: k.GOT_SUBSCRIPTIONS, load: { publishedSubs, rewardsSubs } })

    debug('Login complete')
  } catch (err) {
    debug('Error: %O', err)
  }
}