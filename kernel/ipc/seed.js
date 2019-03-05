const debug = require('debug')('ara:fm:kernel:ipc:seed')

const { events } = require('k')
const { internalEmitter } = require('electron-window-manager')
const { ipcMain } = require('electron')
const windowManager = require('electron-window-manager')

const { rewardsDCDN } = require('../daemons')
const dispatch = require('../redux/reducers/dispatch')

const store = windowManager.sharedData.fetch('store')

ipcMain.on(events.START_SEEDING, (_, load) => _startSeeding(load))

internalEmitter.on(events.START_SEEDING, load => _startSeeding(load))

function _startSeeding(load) {
  debug('%s HEARD', events.START_SEEDING)
  debug
  const { farmer } = store
  try {
    rewardsDCDN.joinBroadcast({ farmer: farmer.farm, did: load.did })
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
    rewardsDCDN.unjoinBroadcast({ farmer: farmer.farm, did: load.did})
    dispatch({ type: events.CHANGE_BROADCASTING_STATE, load: { did: load.did, shouldBroadcast: false } })
    windowManager.pingView({ view: 'filemanager', event: events.REFRESH })
  } catch (err) {
    debug('Error stopping seed: %o', err)
  }
})