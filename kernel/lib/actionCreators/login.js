'use strict'

const araContractsManager = require('../actions/araContractsManager')
const dispatch = require('../reducers/dispatch')
const { LOGIN_DEV, LOGIN, LOGGED_IN } = require('../../../lib/constants/stateManagement')
const { accountSelection } = require('../actions/index')
const windowManager = require('electron-window-manager')

windowManager.bridge.on(LOGIN, load => {
  const accounts = accountSelection.osxSurfaceAids()
  const newState = dispatch({ type: LOGIN, load: accounts })
  windowManager.bridge.emit(LOGGED_IN, newState)
})

windowManager.bridge.on(LOGIN_DEV, async load => {
  const account = accountSelection.osxSurfaceAids().filter(({ afs }) => afs === load.afsId)[0]
  try {
    const accountAddress = await araContractsManager.getAccountAddress(account.ddo.id, load.password)
    const newState = dispatch({
      type: LOGIN_DEV,
      load: {
        account,
        accountAddress,
        password: load.password,
      }
    })
    windowManager.bridge.emit(LOGGED_IN, newState)
  } catch(e) {
    console.log(e)
  }
})