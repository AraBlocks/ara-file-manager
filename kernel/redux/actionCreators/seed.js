const debug = require('debug')('afm:kernel:lib:actionCreators:seed')
const { farmerManager } = require('../actions')
const dispatch = require('../reducers/dispatch')
const { events } = require('k')
const { ipcMain } = require('electron')
const { internalEmitter } = require('electron-window-manager')
const windowManager = require('electron-window-manager')
const store = windowManager.sharedData.fetch('store')

ipcMain.on(events.START_SEEDING, (_, load) => _startSeeding(load))

internalEmitter.on(events.START_SEEDING, load => _startSeeding(load))

function _startSeeding(load) {
  debug('%s HEARD', events.START_SEEDING)
  debug
  const { farmer } = store
  try {
    farmerManager.joinBroadcast({ farmer: farmer.farm, did: load.did })
    dispatch({ type: events.CHANGE_BROADCASTING_STATE, load: { did: load.did, shouldBroadcast: true } })
    windowManager.pingView({ view: 'filemanager', event: events.REFRESH })
  } catch (err) {
    debug('Error starting seed: %o', err)
  }
}

ipcMain.on(events.STOP_SEEDING, (event, load) => {
  debug('%s HEARD', events.STOP_SEEDING)
  const { farmer } = store
  try {
    farmerManager.unjoinBroadcast({ farmer: farmer.farm, did: load.did})
    dispatch({ type: events.CHANGE_BROADCASTING_STATE, load: { did: load.did, shouldBroadcast: false } })
    windowManager.pingView({ view: 'filemanager', event: events.REFRESH })
  } catch (err) {
    debug('Error stopping seed: %o', err)
  }
})