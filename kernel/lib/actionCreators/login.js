'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:login')
const araContractsManager = require('../actions/araContractsManager')
const { surfaceAFS } = require('../actions/afsManager')
const dispatch = require('../reducers/dispatch')
const {
  LOGIN_DEV,
  LOGIN,
  LOGGED_IN
} = require('../../../lib/constants/stateManagement')
const { accountSelection } = require('../actions/index')
const windowManager = require('electron-window-manager')

windowManager.bridge.on(LOGIN, load => {
  const accounts = accountSelection.osxSurfaceAids()
  const newState = dispatch({ type: LOGIN, load: accounts })
  windowManager.bridge.emit(LOGGED_IN, newState)
})

windowManager.bridge.on(LOGIN_DEV, async load => {
  debug('%s heard', LOGIN_DEV)
  try {
    const [ account ] = accountSelection.osxSurfaceAids().filter(({ afs }) => afs === load.afsId)
    const accountAddress = await araContractsManager.getAccountAddress(account.ddo.id, load.password)
    const araBalance = await araContractsManager.getAraBalance(accountAddress)

    dispatch({
      type: LOGIN_DEV,
      load: {
        account,
        accountAddress,
        araBalance,
        password: load.password,
      }
    })
    const library = await araContractsManager.getLibraryItems(account.ddo.id)
    const purchased = await surfaceAFS(library)
    debug('%O', purchased)
  } catch(err) {
    debug('Error: %O', err)
  }
})