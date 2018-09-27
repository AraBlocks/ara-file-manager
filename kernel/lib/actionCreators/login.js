'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:login')
const {
  afsManager,
  araContractsManager
} = require('../actions')
const dispatch = require('../reducers/dispatch')
const {
  GETTING_USER_DATA,
  GOT_EARNINGS,
  GOT_LIBRARY,
  GOT_PUBLISHED_SUBS,
  LOGIN_DEV,
  LOGOUT,
  REFRESH
} = require('../../../lib/constants/stateManagement')
const windowManager = require('electron-window-manager')
const { ipcMain } = require('electron')
const { internalEmitter } = require('electron-window-manager')
const { switchLoginState } = require('../../../boot/tray')

internalEmitter.on(LOGOUT, () => {
  afsManager.stopBroadcast()
  dispatch({ type: LOGOUT })
  switchLoginState(false)
  windowManager.closeWindow('filemanager')
  windowManager.closeWindow('publishFileView')
})

ipcMain.on(LOGIN_DEV, async (event, load) => {
  debug('%s heard %O', LOGIN_DEV, load)
  try {
    dispatch({ type: GETTING_USER_DATA })
    windowManager.openWindow('filemanager')
    const accountAddress = await araContractsManager.getAccountAddress(load.userAid, load.password)
    const araBalance = await araContractsManager.getAraBalance(load.userAid)
    const transferSubscription = araContractsManager.subscribeTransfer(accountAddress)

    dispatch({
      type: LOGIN_DEV,
      load: {
        userAid: load.userAid,
        accountAddress,
        araBalance,
        password: load.password,
        transferSubscription
      }
    })

    switchLoginState(true)

    const purchasedDIDs = await araContractsManager.getLibraryItems(load.userAid)
    const purchased = await afsManager.surfaceAFS(purchasedDIDs)
    const publishedDIDs = await araContractsManager.getPublishedItems()
    const published = await afsManager.surfaceAFS(publishedDIDs)

    let files;
    ({ files } = dispatch({ type: GOT_LIBRARY, load: { published, purchased} }))
    windowManager.pingView({ view: 'filemanager', event: REFRESH })

    const updatedItems = await araContractsManager.getPublishedEarnings(files.published);
    ({ files } = dispatch({ type: GOT_EARNINGS, load: updatedItems }))
    windowManager.pingView({ view: 'filemanager', event: REFRESH })

    const subscriptions = await Promise.all(files.published.map(araContractsManager.subscribePublished))
    dispatch({ type: GOT_PUBLISHED_SUBS, load: subscriptions })

    debug('Login complete')
  } catch (err) {
    debug('Error: %O', err)
  }
})