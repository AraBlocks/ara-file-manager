'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:register')
const k = require('../../../lib/constants/stateManagement')
const araContractsManager = require('../actions/araContractsManager')
const dispatch = require('../reducers/dispatch')
const { register } = require('../actions')
const { switchLoginState } = require('../../../boot/tray')
const windowManager = require('electron-window-manager')
const { ipcMain } = require('electron')

ipcMain.on(k.REGISTER, async (event, password) => {
  debug('%s heard. load: %s', k.REGISTER, password)
  try {
    windowManager.pingView({ view: 'registration', event: k.REGISTERING })

    const identity = await register.create(password)
    await register.archive(identity)

    const { did: { did }, mnemonic } = identity
    const accountAddress = await araContractsManager.getAccountAddress(did, password)
    debug('Dispatching %s', k.LOGIN)
    dispatch({
      type: k.REGISTERED,
      load: {
        accountAddress,
        araBalance: 0,
        mnemonic,
        password: password,
        userAid: did
      }
    })

    switchLoginState(true)
    windowManager.pingView({ view: 'registration', event: k.REGISTERED })
  } catch (err) {
    debug('Error registering: %O', err)
  }
})