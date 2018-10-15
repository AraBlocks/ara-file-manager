'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:publish')
const afs = require('ara-filesystem')
const dispatch = require('../reducers/dispatch')
const { ipcMain } = require('electron')
const {
  afsManager,
  farmerManager,
  publish
} = require('../actions')
const k = require('../../../lib/constants/stateManagement')
const windowManager = require('electron-window-manager')
const { account, farmer } = windowManager.sharedData.fetch('store')

ipcMain.on(k.FEED_MANAGE_FILE, (event, load) => dispatch({ type: k.FEED_MANAGE_FILE, load }))

ipcMain.on(k.UPDATE_FILE, async (event, load) => {
  debug('%s heard. Load: %O', k.UPDATE_FILE, load)
  try {
    event.sender.send(k.ESTIMATING_COST)
    let estimate
    if (load.paths.length == 0) {
      estimate = await afs.estimateSetPriceGasCost({ did: load.fileAid, password: account.password, price: Number(load.price) })
    } else {
      await afsManager.removeAllFiles({ did: load.fileAid, password: account.password })
      estimate = await afs.estimateCommitGasCost({ did: load.fileAid, password: account.password })
    }

    const dispatchLoad = {
      did: load.fileAid,
      gasEstimate: Number(estimate),
      name: load.name,
      paths: load.paths,
      price: load.price,
    }

    debug('Dispatching %s . Load: %O', k.FEED_MODAL, dispatchLoad)
    dispatch({ type: k.FEED_MODAL, load: dispatchLoad })
    event.sender.send(k.ESTIMATION)
  } catch(err) {
    debug('Error: %O', err)
  }
})

ipcMain.on(k.CONFIRM_UPDATE_FILE, async (event, load) => {
  debug('%s heard. Load: %o', k.CONFIRM_UPDATE_FILE, load)
  try {
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

    if (load.paths.length == 0) {
      debug('Updating price only')
      await afs.setPrice({ did: load.did, password: account.password, price: Number(load.price) })
    } else {
      debug('Updating Files and/or Price')
      await afs.commit({ did: load.did, price: Number(load.price), password: account.password })
    }
    updateCompleteHandler(load.did)
  } catch (err) {
    debug('Error: %O', err)
  }
})

function updateCompleteHandler(did) {
  dispatch({ type: k.UPDATED_FILE, load: did })
  debug('Dispatch %s . Load: %s', k.UPDATED_FILE, did)
  farmerManager.broadcast({ did, farmer: farmer.farm })
  windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
}