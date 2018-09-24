'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:login')
const {
  accountSelection,
  afsManager,
  araContractsManager
} = require('../actions')
const dispatch = require('../reducers/dispatch')
const {
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

internalEmitter.on(LOGOUT, () => {
  dispatch({ type: LOGOUT, load: null })
  windowManager.pingView({ view: 'filemanager', event: REFRESH })
})

ipcMain.on(LOGIN_DEV, async (event, load) => {
  debug('%s heard %O', LOGIN_DEV, load)
  try {
    const accountAddress = await araContractsManager.getAccountAddress(load.userAid, load.password)
    const araBalance = await araContractsManager.getAraBalance(accountAddress)
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

    const items = {}
    araContractsManager.getLibraryItems(load.userAid)
      .then(afsManager.surfaceAFS)
      .then(purchased => items.purchased = purchased)
      .then(araContractsManager.getPublishedItems)
      .then(afsManager.surfaceAFS)
      .then(published => items.published = published)
      .then(() => dispatch({ type: GOT_LIBRARY, load: items }))
      .then(state => araContractsManager.getPublishedEarnings(state.files.published))
      .then(updatedItems => dispatch({ type: GOT_EARNINGS, load: updatedItems }))
      .then(({ files }) => Promise.all(files.published.map(araContractsManager.subscribePublished)))
      .then(subscriptions => {
        dispatch({ type: GOT_PUBLISHED_SUBS, load: subscriptions })
        windowManager.pingView({ view: 'filemanager', event: REFRESH })
      })
      .catch(err => debug('getLibraryItems Err: %o', err))
  } catch (err) {
    debug('Error: %O', err)
  }
})