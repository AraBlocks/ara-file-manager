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
  LOADING_LIBRARY,
  LOGIN_DEV,
  LOGIN,
  LOGGED_IN,
  REFRESH
} = require('../../../lib/constants/stateManagement')
const windowManager = require('electron-window-manager')


windowManager.bridge.on(LOGIN, load => {
  const accounts = accountSelection.osxSurfaceAids()
  const newState = dispatch({ type: LOGIN, load: accounts })
  windowManager.bridge.emit(LOGGED_IN, newState)
})

windowManager.bridge.on(LOGIN_DEV, async load => {
  debug('%s heard', LOGIN_DEV)
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

    const purchasedDIDs = await araContractsManager.getLibraryItems(load.userAid)
    const purchased = await afsManager.surfaceAFS(purchasedDIDs)
    const publishedDIDs = await araContractsManager.getPublishedItems()
    const published = await afsManager.surfaceAFS(publishedDIDs)

    let files;
    ({ files } = dispatch({ type: GOT_LIBRARY, load: { published, purchased} }))
    windowManager.pingView({ view: 'filemanager', event: REFRESH })

    const updatedItems = await araContractsManager.getPublishedEarnings(files.published);
    ({ files } = dispatch({ type: GOT_EARNINGS, load: updatedItems }))

    const subscriptions = await Promise.all(files.published.map(araContractsManager.subscribePublished))
    dispatch({ type: GOT_PUBLISHED_SUBS, load: subscriptions })

    debug('Login complete')
  } catch (err) {
    debug('Error: %O', err)
  }
})