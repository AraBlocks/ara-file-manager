'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:update')
const afs = require('ara-filesystem')
const dispatch = require('../reducers/dispatch')
const { ipcMain } = require('electron')
const { afsManager, farmerManager, araContractsManager } = require('../actions')
const k = require('../../../lib/constants/stateManagement')
const windowManager = require('electron-window-manager')
const store = windowManager.sharedData.fetch('store')

ipcMain.on(k.FEED_MANAGE_FILE, async (event, load) => {
  try {
    const { files } = store
    const file = files.published.find(({ did }) => did === load.did)
    dispatch({ type: k.FEED_MANAGE_FILE, load: { did: load.did, price: file.price, name: load.name, fileList: [] } })
    windowManager.openWindow('manageFileView')
    const fileList = await afsManager.getFileList(load.did)
    dispatch({ type: k.FEED_MANAGE_FILE, load: { did: load.did, price: file.price, name: load.name, fileList } })
    windowManager.pingView({ view: 'manageFileView', event: k.REFRESH })
  } catch(err) {
    debug('Error: %o', err)
  }
})

ipcMain.on(k.UPDATE_FILE, async (event, load) => {
  debug('%s heard. Load: %O', k.UPDATE_FILE, load)
  const { account, farmer } = store
  try {
    event.sender.send(k.ESTIMATING_COST)
    await farmerManager.unjoinBroadcast({ farmer: farmer.farm, did: load.did })
    const previousPrice = await araContractsManager.getAFSPrice({ did: load.did })
    const shouldCommit = !(load.addPaths.length == 0 && load.removePaths.length == 0)
    const shouldUpdatePrice = previousPrice != load.price
    let estimate

    if (!shouldCommit && !shouldUpdatePrice) {
      debug('nothing to update')
      windowManager.closeWindow('manageFileView')
      // TODO: Show some nothing to update modal
      return
    } else if (shouldUpdatePrice && !shouldCommit) {
      debug('Estimating gas for set price')
      estimate = await afs.setPrice({ did: load.did, password: account.password, price: Number(load.price), estimate: true })
    } else {
      await (await afs.add({ did: load.did, paths: load.addPaths, password: account.password })).close();
      await (await afs.remove({ did: load.did, paths: load.removePaths, password: account.password })).close();
      if (shouldUpdatePrice) {
        debug('Estimate gas for commit and set price')
        estimate = await afs.commit({ did: load.did, password: account.password, price: Number(load.price), estimate: true })
      } else {
        debug('Estimating gas for commit only')
        estimate = await afs.commit({ did: load.did, password: account.password, estimate: true })
      }
    }

    const dispatchLoad = {
      did: load.did,
      gasEstimate: Number(estimate),
      name: load.name,
      price: load.price,
      shouldUpdatePrice,
      shouldCommit
    }

    debug('Dispatching %s . Load: %O', k.FEED_MODAL, dispatchLoad)
    dispatch({ type: k.FEED_MODAL, load: dispatchLoad })
    event.sender.send(k.ESTIMATION)
  } catch (err) {
    debug('Error: %O', err)
  }
})

ipcMain.on(k.CONFIRM_UPDATE_FILE, async (event, load) => {
  debug('%s heard. Load: %o', k.CONFIRM_UPDATE_FILE, load)
  const { account, farmer } = store
  try {
    dispatch({
      type: k.UPDATING_FILE,
      load: {
        did: load.did,
        name: load.name,
        price: load.price
      }
    })

    windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
    windowManager.closeWindow('manageFileView')

    if (load.shouldUpdatePrice && !load.shouldCommit) {
      debug('Updating price only')
      await afs.setPrice({ did: load.did, password: account.password, price: Number(load.price) })
    } else if (!load.shouldUpdatePrice && load.shouldCommit){
      debug('Updating Files')
      await afs.commit({ did: load.did, password: account.password })
    } else {
      debug('Updating Files and Price')
      await afs.commit({ did: load.did, password: account.password, price: Number(load.price) })
    }

    dispatch({ type: k.UPDATED_FILE, load: load.did })
    debug('Dispatch %s . Load: %s', k.UPDATED_FILE, load.did)
    farmerManager.joinBroadcast({ did: load.did, farmer: farmer.farm })
    windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
  } catch (err) {
    debug('Error: %O', err)
  }
})