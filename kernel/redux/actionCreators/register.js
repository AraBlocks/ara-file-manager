'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:register')
const k = require('../../../lib/constants/stateManagement')
const araContractsManager = require('../actions/araContractsManager')
const dispatch = require('../reducers/dispatch')
const { identityManager, afsManager, afmManager } = require('../actions')
const { switchLoginState } = require('../../../boot/tray')
const { switchApplicationMenuLoginState } = require('../../../boot/menu')
const windowManager = require('electron-window-manager')
const { ipcMain } = require('electron')

ipcMain.on(k.REGISTER, async (event, password) => {
  debug('%s heard. load: %s', k.REGISTER, password)
  try {
    windowManager.pingView({ view: 'registration', event: k.REGISTERING })

    const identity = await identityManager.create(password)
    await identityManager.archive(identity)

    const { did: { did }, mnemonic } = identity
    const accountAddress = await araContractsManager.getAccountAddress(did, password)

    const deployEstimateDid = await afsManager.createDeployEstimateAfs(did, password)
    afmManager.cacheUserDid(did)
    debug('Dispatching %s', k.REGISTERED)
    dispatch({
      type: k.REGISTERED,
      load: {
        accountAddress,
        araBalance: 0,
        deployEstimateDid,
        ethBalance: 0,
        mnemonic,
        password,
        userAid: did
      }
    })
    switchLoginState(true)
    switchApplicationMenuLoginState(true)

    windowManager.pingView({ view: 'registration', event: k.REGISTERED })
  } catch (err) {
    debug('Error registering: %O', err)
  }
})