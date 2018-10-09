'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:publish')
const dispatch = require('../reducers/dispatch')
const { ipcMain } = require('electron')
const {
  afsManager,
  farmerManager,
  publish
} = require('../actions')
const k = require('../../../lib/constants/stateManagement')
const windowManager = require('electron-window-manager')
const { account } = windowManager.sharedData.fetch('store')

ipcMain.on(k.FEED_MANAGE_FILE, (event, load) => dispatch({ type: k.FEED_MANAGE_FILE, load }))

ipcMain.on(k.UPDATE_FILE, async (event, load) => {
  debug('%s heard. Load: %O', k.UPDATE_FILE, load)
  dispatch({ type: k.CHANGE_BROADCASTING_STATE, load: false })
  try {
    event.sender.send(k.ESTIMATING_COST)
    let estimate
    if (load.paths.length == 0) {
      estimate = await publish.setPriceGasEstimate(load)
    } else {
      await afsManager.removeAllFiles({ did: load.fileAid, password: account.password })
      estimate = await publish.addCreateEstimate(load)
    }
    debug('Dispatching %s . Load: %O', k.FEED_MODAL, estimate)
    dispatch({ type: k.FEED_MODAL, load: estimate })
    event.sender.send(k.ESTIMATION)
  } catch(err) {
    debug('Error: %O', err)
  }
})

ipcMain.on(k.CONFIRM_UPDATE_FILE, async (event, load) => {
  debug('%s heard. Load: %o', k.CONFIRM_UPDATE_FILE, load)
  try {
    if (load.paths.length == 0) {
      debug('Updating price only')
      await publish.setPrice({ ...load, password: account.password })
    } else {
      debug('Updating Files and/or Price')
      await publish.commit({ ...load, password: account.password })
    }
    updateCompleteHandler(load.did)

    dispatch({
      type: k.UPDATING_FILE,
      load: {
        aid: load.did,
        name: load.name,
        price: load.price
      }
    })

    windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
    windowManager.closeWindow('manageFileView')
  } catch (err) {
    debug('Error: %O', err)
  }
})

function updateCompleteHandler(did) {
  windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
  dispatch({ type: k.UPDATED_FILE, load: did })
  debug('Dispatch %s . Load: %s', k.UPDATED_FILE, did)
  afsManager.unarchiveAFS({ did, path: did })
  farmerManager.broadcast({ did })
  dispatch({ type: k.CHANGE_BROADCASTING_STATE, load: true })
}