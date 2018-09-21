'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:publish')
const { create, remove } = require('ara-filesystem')
const dispatch = require('../reducers/dispatch')
const { ipcMain } = require('electron')
const {
  afsManager,
  publish
} = require('../actions')
const {
  CHANGE_BROADCASTING_STATE,
  CONFIRM_UPDATE_FILE,
  ESTIMATION,
  ESTIMATING_COST,
  FEED_MODAL,
  FEED_MANAGE_FILE,
  UPDATE_FILE,
  UPDATED_FILE,
  UPDATING_FILE,
} = require('../../../lib/constants/stateManagement')
const windowManager = require('electron-window-manager')
const { account } = windowManager.sharedData.fetch('store')

ipcMain.on(FEED_MANAGE_FILE, (event, load) => dispatch({ type: FEED_MANAGE_FILE, load }))

ipcMain.on(UPDATE_FILE, async (event, load) => {
  debug('%s heard. Load: %O', UPDATE_FILE, load)
  afsManager.stopBroadcast()
  dispatch({ type: CHANGE_BROADCASTING_STATE, load: false })
  try {
    event.sender.send(ESTIMATING_COST)
    let estimate
    if (load.paths.length == 0) {
      estimate = await publish.setPriceGasEstimate(load)
    } else {
      await afsManager.removeAllFiles({ did: load.fileAid })
      estimate = await publish.addCreateEstimate(load)
    }
    debug('Dispatching %s . Load: %O', FEED_MODAL, estimate)
    dispatch({ type: FEED_MODAL, load: estimate })
    event.sender.send(ESTIMATION)
  } catch(err) {
    debug('Error: %O', err)
  }
})

ipcMain.on(CONFIRM_UPDATE_FILE, async (event, load) => {
  debug('%s heard. Load: %o', CONFIRM_UPDATE_FILE, load)
  try {
    if (load.paths.length == 0) {
      debug('Updating price only')
      publish.setPrice({ ...load, password: account.password })
        .then(async () => updateCompleteHandler(load.did))
        .catch(debug)
    } else {
      debug('Updating Files and/or Price')
      publish.commit({ ...load, password: account.password })
        .then(async () => updateCompleteHandler(load.did))
        .catch(debug)
    }

    dispatch({
      type: UPDATING_FILE,
      load: {
        aid: load.did,
        name: load.name,
        price: load.price
      }
    })

    windowManager.pingView({ view: 'filemanager', event: UPDATING_FILE })
    windowManager.get('manageFileView').close()
  } catch (err) {
    debug('Error: %O', err)
  }
})

function updateCompleteHandler(did) {
  windowManager.pingView({ view: 'filemanager', event: UPDATED_FILE })
  dispatch({ type: UPDATED_FILE, load: did })
  debug('Dispatch %s . Load: %s', UPDATED_FILE, did)
  afsManager.unarchiveAFS({ did, path: afsManager.makeAfsPath(did) })
  afsManager.broadcast({ did: did })
  dispatch({ type: CHANGE_BROADCASTING_STATE, load: true })
}