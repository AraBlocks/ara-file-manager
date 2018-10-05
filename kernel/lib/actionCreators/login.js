'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:login')
const araUtil = require('ara-util')
const {
  acmManager,
  afsManager,
  araContractsManager,
  farmerManager
} = require('../actions')
const dispatch = require('../reducers/dispatch')
const k = require('../../../lib/constants/stateManagement')
const { SECRET } = require('../../../lib/constants/networkKeys')
const windowManager = require('electron-window-manager')
const { ipcMain } = require('electron')
const { internalEmitter } = require('electron-window-manager')
const { switchLoginState } = require('../../../boot/tray')
const store = windowManager.sharedData.fetch('store')

internalEmitter.on(k.LOGOUT, () => {
  farmerManager.stopBroadcast(store.farmer.farm)
  dispatch({ type: k.LOGOUT })
  switchLoginState(false)
  windowManager.closeWindow('filemanager')
  windowManager.closeWindow('publishFileView')
})

ipcMain.on(k.LOGIN, async (event, load) => {
  debug('%s heard', k.LOGIN)
  try {
    const ddo = await araUtil.resolveDDO(load.userAid, {keyringOpts:{secret:SECRET}})
    const incorrectPW = !(await araUtil.isCorrectPassword({ ddo, password: load.password}))
    if (incorrectPW) { throw 'IncorrectPW' }
  } catch (err) {
    debug('Login error: %o', err)
    dispatch({ type: k.FEED_MODAL, load: { modalName: 'loginFail' } })
    internalEmitter.emit(k.OPEN_MODAL, 'generalMessageModal')
    return
  }

  try {
    dispatch({ type: k.GETTING_USER_DATA })
    windowManager.openWindow('filemanager')

    const accountAddress = await araContractsManager.getAccountAddress(load.userAid, load.password)
    const araBalance = await araContractsManager.getAraBalance(load.userAid)
    const transferSubscription = araContractsManager.subscribeTransfer(accountAddress)
    const farmer = farmerManager.createFarmer({ did: load.userAid, password: load.password })

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

    const purchasedDIDs = await araContractsManager.getLibraryItems(load.userAid)
    const purchased = await afsManager.surfaceAFS(purchasedDIDs)
    const publishedDIDs = await acmManager.getPublishedItems(load.userAid)
    const published = await afsManager.surfaceAFS(publishedDIDs)
    let files;
    ({ files } = dispatch({ type: k.GOT_LIBRARY, load: { published, purchased} }))
    windowManager.pingView({ view: 'filemanager', event: k.REFRESH })

    const updatedItems = await araContractsManager.getPublishedEarnings(files.published);
    ({ files } = dispatch({ type: k.GOT_EARNINGS, load: updatedItems }))
    windowManager.pingView({ view: 'filemanager', event: k.REFRESH })

    const subscriptions = await Promise.all(files.published.map(araContractsManager.subscribePublished))
    dispatch({ type: k.GOT_PUBLISHED_SUBS, load: subscriptions })

    debug('Login complete')
  } catch (err) {
    debug('Error: %O', err)
  }
})