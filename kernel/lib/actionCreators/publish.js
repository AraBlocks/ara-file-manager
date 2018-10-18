'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:publish')
const afs = require('ara-filesystem')
const dispatch = require('../reducers/dispatch')
const { ipcMain } = require('electron')
const {
  afsManager,
  acmManager,
  araContractsManager,
  farmerManager,
  utils: actionsUtil
} = require('../actions')
const k = require('../../../lib/constants/stateManagement')
const fs = require('fs')
const windowManager = require('electron-window-manager')
const { internalEmitter } = require('../../lib/lsWindowManager')
const store = windowManager.sharedData.fetch('store')

ipcMain.on(k.PUBLISH, async (event, load) => {
  debug('%s heard', k.PUBLISH)
  const { password } = store.account
  try {
    windowManager.pingView({ view: 'publishFileView', event: k.ESTIMATING_COST })

    let { afs: newAFS, afs: { did } } = await afs.create({ owner: load.userAid, password })
    await newAFS.close();
    (await afs.add({ did, paths: load.paths, password })).close()

    const size = load.paths.reduce((sum, file) => sum += fs.statSync(file).size, 0)
    actionsUtil.writeFileMetaData({ did, size, title: load.name })

    debug('Estimating gas')
    const commitEstimate = await afs.estimateCommitGasCost({ did, password })
    let setPriceEstimate = 0
    if (load.price != null) {
      setPriceEstimate = await afs.estimateSetPriceGasCost({ did, password, price: Number(load.price) })
    }
    const gasEstimate = Number(commitEstimate) + Number(setPriceEstimate)
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
  debug('%s heard', k.CONFIRM_PUBLISH)
  const { account, farmer } = store
  try {
    acmManager.savePublishedItem(load.did, account.userAid)

    const descriptorOpts = {
      datePublished: new Date,
      name: load.name,
      price: load.price,
      size: load.size,
      status: k.PUBLISHING
    }
    let descriptor = await actionsUtil.descriptorGenerator(load.did, descriptorOpts)
    dispatch({ type: k.PUBLISHING, load: descriptor })

    windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
    windowManager.closeWindow('publishFileView')

    await afs.commit({ did: load.did, price: Number(load.price), password: account.password })

    const balance = await araContractsManager.getAraBalance(account.userAid)
    debug('Dispatching %s', k.PUBLISHED)
    dispatch({ type: k.PUBLISHED, load: { balance, did: load.did } })
    windowManager.pingView({ view: 'filemanager', event: k.REFRESH })

    const subscription = await araContractsManager.subscribePublished({ did: load.did })
    dispatch({ type: k.ADD_PUBLISHED_SUB, load: [subscription]})
    // afsManager.unarchiveAFS({ did: load.did })

    farmerManager.joinBroadcast({ farmer: farmer.farm, did: load.did })
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
