'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:update')
const afs = require('ara-filesystem')
const dispatch = require('../reducers/dispatch')
const { ipcMain } = require('electron')
const { afsManager, farmerManager, utils: actionsUtil } = require('../actions')
const k = require('../../../lib/constants/stateManagement')
const windowManager = require('electron-window-manager')
const { internalEmitter } = require('electron-window-manager')
const store = windowManager.sharedData.fetch('store')

ipcMain.on(k.FEED_MANAGE_FILE, feedManageFile)

windowManager.internalEmitter.on(k.FEED_MANAGE_FILE, (load) => feedManageFile(null, load))

ipcMain.on(k.UPDATE_FILE, async (event, load) => {
  debug('%s heard. Load: %O', k.UPDATE_FILE, load)
  const { account } = store
  try {
    event.sender.send(k.ESTIMATING_COST)
    let estimate

    if (load.shouldUpdatePrice && !load.shouldCommit) {
      debug('Estimating gas for set price')
      estimate = await afs.setPrice({ did: load.did, password: account.password, price: Number(load.price), estimate: true })
    } else {
      if (load.addPaths.length != 0) {
        await (await afs.add({ did: load.did, paths: load.addPaths, password: account.password })).close()
      }
      if (load.removePaths.length != 0) {
        await (await afs.remove({ did: load.did, paths: load.removePaths, password: account.password })).close()
      }
      await actionsUtil.writeFileMetaData({ did: load.did, size: load.size, title: load.name, password: account.password })
      if (load.shouldUpdatePrice) {
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
      size: load.size,
      shouldUpdatePrice: load.shouldUpdatePrice,
      shouldCommit: load.shouldCommit
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
        price: load.price,
        size: load.size
      }
    })

    internalEmitter.emit(k.CHANGE_PENDING_TRANSACTION_STATE, true)
    windowManager.closeWindow('manageFileView')

    if (load.shouldUpdatePrice && !load.shouldCommit) {
      debug('Updating price only')
      await afs.setPrice({ did: load.did, password: account.password, price: Number(load.price) })
    } else if (!load.shouldUpdatePrice && load.shouldCommit) {
      debug('Updating Files')
      await afs.commit({ did: load.did, password: account.password })
    } else {
      debug('Updating Files and Price')
      await afs.commit({ did: load.did, password: account.password, price: Number(load.price) })
    }

    dispatch({ type: k.UPDATED_FILE, load })
    debug('Dispatch %s . Load: %s', k.UPDATED_FILE, load)
    dispatch({ type: k.CHANGE_BROADCASTING_STATE, load: { did: load.did, shouldBroadcast: true } })
    farmerManager.joinBroadcast({ did: load.did, farmer: farmer.farm })
    internalEmitter.emit(k.CHANGE_PENDING_TRANSACTION_STATE, false)

    dispatch({ type: k.FEED_MODAL, load: { modalName: 'updateSuccessModal', load: { fileName: load.name } } })
    windowManager.openModal('generalMessageModal')
  } catch (err) {
    debug('Error: %O', err)
  }
})

async function feedManageFile(_, load) {
  debug('%s heard', k.FEED_MANAGE_FILE)
  try {
    const { files, farmer } = store
    const file = files.published.find(({ did }) => did === load.did)
    dispatch({
      type: k.FEED_MANAGE_FILE,
      load: {
        did: load.did,
        price: file.price,
        name: load.name,
        fileList: []
      }
    })
    windowManager.openWindow('manageFileView')
    dispatch({ type: k.CHANGE_BROADCASTING_STATE, load: { did: load.did, shouldBroadcast: false } })
    await farmerManager.unjoinBroadcast({ farmer: farmer.farm, did: load.did })

    //The OR conditional is to avoid race conditions. If filelength is 0, pingView happens before manageFileView is created 
    const fileList = await afsManager.getFileList(load.did).length || await new Promise(_ => setTimeout(_, 1000, []))
    dispatch({
      type: k.FEED_MANAGE_FILE,
      load: {
        did: load.did,
        price: file.price,
        name: load.name,
        fileList
      }
    })

    windowManager.pingView({ view: 'manageFileView', event: k.REFRESH })
  } catch (err) {
    debug('Error: %o', err)
  }
}