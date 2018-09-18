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
  LOGIN_DEV,
  LOGIN,
  LOGGED_IN
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

    dispatch({
      type: LOGIN_DEV,
      load: {
        userAid: load.userAid,
        accountAddress,
        araBalance,
        password: load.password,
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
      .then(updatedItems => dispatch({ type: GOT_EARNINGS, load: updatedItems}))
      .then(state => state.files.published.forEach(araContractsManager.purchaseSubscribe))
      .catch(err => debug('getLibraryItems Err: %o', err))
  } catch (err) {
    debug('Error: %O', err)
  }
})