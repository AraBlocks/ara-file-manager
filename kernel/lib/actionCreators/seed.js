'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:subscription')
const { farmerManager } = require('../actions')
const dispatch = require('../reducers/dispatch')
const k = require('../../../lib/constants/stateManagement')
const { ipcMain } = require('electron')
const windowManager = require('electron-window-manager')

ipcMain.on(k.SEED, (event, load) => {
  debug('%s HEARD', k.SEED)
  const { did }  = load
  try {
    farmerManager.joinBroadcast({ farmer, did })
    dispatch({ type: CHANGE_BROADCASTING_STATE, load: { did, shouldBroadcast: true } })
    windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
  } catch (err) {
    debug('Err starting seed: %o', err)
  }
})

ipcMain.on(k.STOP_SEEDING, (event, load) => {
  const { did } = load
  debug('%s HEARD', k.STOP_SEEDING)
  try {
    farmerManager.unjoinBroadcast({ farmer, did })
    dispatch({ type: CHANGE_BROADCASTING_STATE, load: { did, shouldBroadcast: false } })
    windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
  } catch (err) { }
})