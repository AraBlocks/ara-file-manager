'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:publish')
const afs = require('ara-filesystem')
const dispatch = require('../reducers/dispatch')
const { ipcMain } = require('electron')
const {
  afsManager,
  acmManager,
  araContractsManager,
  publish,
  farmerManager,
  util: actionsUtil
} = require('../actions')
const k = require('../../../lib/constants/stateManagement')
const fs = require('fs')
const windowManager = require('electron-window-manager')
const { internalEmitter } = require('../../lib/lsWindowManager')
const store = windowManager.sharedData.fetch('store')

const keyringOpts = { secret: 'test-node' }

ipcMain.on(k.PUBLISH, async (event, load) => {
  debug('%s heard', k.PUBLISH)
  const { password } = store.account
  try {
    windowManager.pingView({ view: 'publishFileView', event: k.ESTIMATING_COST })

    let { afs: newAFS, afs: { did } } = await afs.create({ owner: load.userAid, password, keyringOpts })
    await newAFS.close();
    (await afs.add({ did, paths: load.paths, password, keyringOpts })).close()

    const size = load.paths.reduce((sum, file) => sum += fs.statSync(file).size, 0)
    actionsUtil.writeFileMetaData({ did, size, title: load.name })

    debug('Estimating gas')
    let gasEstimate
    gasEstimate = await afs.estimateCommitGasCost({ did, password, keyringOpts })
    debug({gasEstimate})
    if (load.price != null) {
      const x = await afs.estimateSetPriceGasCost({ did, password, price: load.price, keyringOpts })
      debug({x})
      gasEstimate += x
    }
    debug('Gas estimate: %s', gasEstimate)

    debug('Dispatching %s', k.FEED_MODAL)
    const dispatchLoad = {
      did,
      gasEstimate,
      name: load.name,
      paths: load.paths,
      price: load.price,
      size
    }
    dispatch({ type: k.FEED_MODAL, load: dispatchLoad })

    windowManager.pingView({ view: 'publishFileView', event: k.ESTIMATION })
  } catch (err) {
    debug('Error publishing file %o:', err)
    dispatch({ type: k.FEED_MODAL, load: { modalName: 'failureModal2' } })
    internalEmitter.emit(k.OPEN_MODAL, 'generalMessageModal')
    windowManager.closeWindow('publishFileView')
    return
  }
})

ipcMain.on(k.CONFIRM_PUBLISH, async (event, load) => {
  debug('%s heard. Load: %o', k.CONFIRM_PUBLISH, load)
  const { account, farmer } = store
  try {
    acmManager.savePublishedItem(load.did, account.userAid)
    const descriptor = await actionsUtil.descriptorGeneratorPublishing({ ...load })
    dispatch({ type: k.PUBLISHING, load: descriptor })

    windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
    windowManager.closeWindow('publishFileView')

    await afs.commit({ ...load, password: account.password, keyringOpts })
    const araBalance = await araContractsManager.getAraBalance(account.userAid)
    debug('Dispatching %s', k.PUBLISHED)
    dispatch({ type: k.PUBLISHED, load: araBalance })
    windowManager.pingView({ view: 'filemanager', event: k.REFRESH })

    araContractsManager.subscribePublished({ did: load.did })
    afsManager.unarchiveAFS({ did: load.did, path: afsManager.makeAfsPath(load.did) })

    debug('Dispatching %s', k.CHANGE_BROADCASTING_STATE)
    dispatch({ type: k.CHANGE_BROADCASTING_STATE, load: true })
    farmerManager.broadcast({ farmer: farmer.farm, did: load.did })
  } catch (err) {
    debug('Error in committing: %o', err)
    debug('Removing %s from .acm', load.did)

    acmManager.removedPublishedItem(load.did, account.userAid)
    dispatch({ type: k.ERROR_PUBLISHING })

    windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
    //Needs short delay. Race conditions cause modal state to dump after its loaded
    setTimeout(() => {
      dispatch({ type: k.FEED_MODAL, load: { modalName: 'failureModal2' } })
      internalEmitter.emit(k.OPEN_MODAL, 'generalMessageModal')
    }, 500)
  }
})
