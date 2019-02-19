const debug = require('debug')('ara:fm:kernel:ipc:seed')
const { farmerManager } = require('../daemons')
const dispatch = require('../state/dispatch')
const { events: k } = require('k')
const { ipcMain } = require('electron')
const { internalEmitter } = require('electron-window-manager')
const windowManager = require('electron-window-manager')
const store = windowManager.sharedData.fetch('store')

ipcMain.on(k.START_SEEDING, (event, load) => _startSeeding(load))

internalEmitter.on(k.START_SEEDING, load => _startSeeding(load))

function _startSeeding(load) {
  debug('%s HEARD', k.START_SEEDING)
  debug
  const { farmer } = store
  try {
    farmerManager.joinBroadcast({ farmer: farmer.farm, did: load.did })
    dispatch({ type: k.CHANGE_BROADCASTING_STATE, load: { did: load.did, shouldBroadcast: true } })
    windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
  } catch (err) {
    debug('Error starting seed: %o', err)
  }
}

ipcMain.on(k.STOP_SEEDING, (event, load) => {
  debug('%s HEARD', k.STOP_SEEDING)
  const { farmer } = store
  try {
    farmerManager.unjoinBroadcast({ farmer: farmer.farm, did: load.did})
    dispatch({ type: k.CHANGE_BROADCASTING_STATE, load: { did: load.did, shouldBroadcast: false } })
    windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
  } catch (err) {
    debug('Error stopping seed: %o', err)
  }
})
