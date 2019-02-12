'use strict'

const debug = require('debug')('afm:kernel:lib:actionCreators:update')
const afs = require('ara-filesystem')
const dispatch = require('../reducers/dispatch')
const { ipcMain } = require('electron')
const { afsManager, farmerManager, utils: actionsUtil } = require('../actions')
const { stateManagement: k } = require('k')
const { pause } = require('../../lib')
const windowManager = require('electron-window-manager')
const { internalEmitter } = require('electron-window-manager')
const store = windowManager.sharedData.fetch('store')

ipcMain.on(k.FEED_MANAGE_FILE, async (event, load) => {
  debug('%s heard', k.FEED_MANAGE_FILE)
  const { files, farmer } = store
  try {
    const file = files.published.find(({ did }) => did === load.did)
    dispatch({
      type: k.FEED_MANAGE_FILE,
      load: {
        did: load.did,
        price: file.price,
        name: load.name || '',
        fileList: [],
        uncommitted: file.status === k.UNCOMMITTED
      }
    })
    windowManager.openWindow('manageFileView')

    if (file.status === k.UNCOMMITTED) { return }
    dispatch({ type: k.CHANGE_BROADCASTING_STATE, load: { did: load.did, shouldBroadcast: false } })
    await farmerManager.unjoinBroadcast({ farmer: farmer.farm, did: load.did })

    dispatch({
      type: k.FEED_MANAGE_FILE,
      load: {
        did: load.did,
        price: file.price,
        name: load.name,
        fileList: await afsManager.getFileList(load.did),
        uncommitted: false
      }
    })
    windowManager.pingView({ view: 'manageFileView', event: k.REFRESH })
  } catch (err) {
    debug('Error: %o', err)
  }
})

ipcMain.on(k.UPDATE_META, async (_, load) => {
  debug('%s heard', k.UPDATE_META)
  const { account } = store
  const { name, did } = load

  const waitModalLoad = { load: { packageName: load.name }, modalName: 'updatingName' }
  dispatch({ type: k.FEED_MODAL, load: waitModalLoad })
  windowManager.closeWindow('manageFileView')
  windowManager.openModal('generalPleaseWaitModal')

  await pause(2000)

  try {
    await actionsUtil.writeFileMetaData({
      did,
      title: name,
      author: false,
      password: account.password
    })

    dispatch({ type: k.UPDATE_META, load: { name, did } })
    dispatch({ type: k.FEED_MODAL, load: { modalName: 'nameUpdated' } })

    windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
    windowManager.closeWindow('generalPleaseWaitModal')
    windowManager.openModal('generalMessageModal')
  } catch (err) {
  }
})

ipcMain.on(k.UPDATE_FILE, async (_, load) => {
  debug('%s heard', k.UPDATE_FILE)
  const { account } = store
  try {
    dispatch({ type: k.FEED_MODAL, load: { load: { fileName: load.name } } })
    windowManager.openModal('generalPleaseWaitModal')
    windowManager.closeWindow('manageFileView')

    await actionsUtil.writeFileMetaData({
      did: load.did,
      size: load.size,
      title: load.name,
      password: account.password
    })

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
    windowManager.closeModal('generalPleaseWaitModal')
    windowManager.openModal('updateConfirmModal')
  } catch (err) {
    debug('Error: %O', err)
  }
})

ipcMain.on(k.CONFIRM_UPDATE_FILE, async (_, load) => {
  debug('%s heard', k.CONFIRM_UPDATE_FILE)
  const { account } = store
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

    windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
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

    internalEmitter.emit(k.START_SEEDING, load)

    dispatch({ type: k.FEED_MODAL, load: { modalName: 'updateSuccessModal', load: { packageName: load.name } } })
    windowManager.openModal('generalMessageModal')
  } catch (err) {
    debug('Error: %O', err)
  }
})