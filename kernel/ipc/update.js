const debug = require('debug')('ara:fm:kernel:ipc:update')

const araFilesystem = require('ara-filesystem')
const { ipcMain } = require('electron')
const { events } = require('k')
const windowManager = require('electron-window-manager')
const { internalEmitter } = require('electron-window-manager')

const { afs, rewardsDCDN, utils: daemonsUtil } = require('../daemons')
const dispatch = require('../redux/reducers/dispatch')
const { pause } = require('../lib')

const store = windowManager.sharedData.fetch('store')

ipcMain.on(events.FEED_MANAGE_FILE, async (_, load) => {
  debug('%s heard', events.FEED_MANAGE_FILE)
  const { files, farmer } = store
  try {
    const file = files.published.find(({ did }) => did === load.did)
    dispatch({
      type: events.FEED_MANAGE_FILE,
      load: {
        did: load.did,
        price: file.price,
        name: load.name || '',
        fileList: [],
        uncommitted: file.status === events.UNCOMMITTED
      }
    })
    windowManager.openWindow('manageFileView')

    if (file.status === events.UNCOMMITTED) { return }
    dispatch({ type: events.CHANGE_BROADCASTING_STATE, load: { did: load.did, shouldBroadcast: false } })
    await rewardsDCDN.unjoinBroadcast({ farmer: farmer.farm, did: load.did })

    dispatch({
      type: events.FEED_MANAGE_FILE,
      load: {
        did: load.did,
        price: file.price,
        name: load.name,
        fileList: await afs.getFileList(load.did),
        uncommitted: false
      }
    })
    windowManager.pingView({ view: 'manageFileView', event: events.REFRESH })
  } catch (err) {
    debug('Error: %o', err)
  }
})

ipcMain.on(events.UPDATE_META, async (_, load) => {
  debug('%s heard', events.UPDATE_META)
  const { account } = store
  const { name, did } = load

  const waitModalLoad = { load: { packageName: load.name }, modalName: 'updatingName' }
  dispatch({ type: events.FEED_MODAL, load: waitModalLoad })
  windowManager.closeWindow('manageFileView')
  windowManager.openModal('generalPleaseWaitModal')

  await pause(2000)

  try {
    await daemonsUtil.writeFileMetaData({
      did,
      title: name,
      password: account.password
    })

    dispatch({ type: events.UPDATE_META, load: { name, did } })
    dispatch({ type: events.FEED_MODAL, load: { modalName: 'nameUpdated' } })

    windowManager.pingView({ view: 'filemanager', event: events.REFRESH })
    windowManager.closeWindow('generalPleaseWaitModal')
    windowManager.openModal('generalMessageModal')
  } catch (err) {
  }
})

ipcMain.on(events.UPDATE_FILE, async (_, load) => {
  debug('%s heard', events.UPDATE_FILE)
  const { account } = store
  try {
    dispatch({ type: events.FEED_MODAL, load: { load: { fileName: load.name } } })
    windowManager.openModal('generalPleaseWaitModal')
    windowManager.closeWindow('manageFileView')

    await daemonsUtil.writeFileMetaData({
      did: load.did,
      size: load.size,
      title: load.name,
      password: account.password
    })

    let estimate
    if (load.shouldUpdatePrice && !load.shouldCommit) {
      debug('Estimating gas for set price')
      estimate = await araFilesystem.setPrice({ did: load.did, password: account.password, price: Number(load.price), estimate: true })
    } else {
      if (load.addPaths.length != 0) {
        await (await araFilesystem.add({ did: load.did, paths: load.addPaths, password: account.password })).close()
      }
      if (load.removePaths.length != 0) {
        await (await araFilesystem.remove({ did: load.did, paths: load.removePaths, password: account.password })).close()
      }
      if (load.shouldUpdatePrice) {
        debug('Estimate gas for commit and set price')
        estimate = await araFilesystem.commit({ did: load.did, password: account.password, price: Number(load.price), estimate: true })
      } else {
        debug('Estimating gas for commit only')
        estimate = await araFilesystem.commit({ did: load.did, password: account.password, estimate: true })
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

    dispatch({ type: events.FEED_MODAL, load: dispatchLoad })
    windowManager.closeModal('generalPleaseWaitModal')
    windowManager.openModal('updateConfirmModal')
  } catch (err) {
    debug('Error: %O', err)
  }
})

ipcMain.on(events.CONFIRM_UPDATE_FILE, async (_, load) => {
  debug('%s heard', events.CONFIRM_UPDATE_FILE)
  const { account } = store
  try {
    dispatch({
      type: events.UPDATING_FILE,
      load: {
        did: load.did,
        name: load.name,
        price: load.price,
        size: load.size
      }
    })

    windowManager.pingView({ view: 'filemanager', event: events.REFRESH })
    windowManager.closeWindow('manageFileView')

    if (load.shouldUpdatePrice && !load.shouldCommit) {
      debug('Updating price only')
      await araFilesystem.setPrice({ did: load.did, password: account.password, price: Number(load.price) })
    } else if (!load.shouldUpdatePrice && load.shouldCommit) {
      debug('Updating Files')
      await araFilesystem.commit({ did: load.did, password: account.password })
    } else {
      debug('Updating Files and Price')
      await araFilesystem.commit({ did: load.did, password: account.password, price: Number(load.price) })
    }

    dispatch({ type: events.UPDATED_FILE, load })

    internalEmitter.emit(events.START_SEEDING, load)

    dispatch({ type: events.FEED_MODAL, load: { modalName: 'updateSuccessModal', load: { fileName: load.name } } })
    windowManager.openModal('generalMessageModal')
  } catch (err) {
    debug('Error: %O', err)
  }
})