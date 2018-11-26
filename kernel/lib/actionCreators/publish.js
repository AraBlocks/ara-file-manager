'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:publish')
const afs = require('ara-filesystem')
const dispatch = require('../reducers/dispatch')
const { ipcMain } = require('electron')
const {
  acmManager,
  araContractsManager,
  farmerManager,
  utils: actionsUtil
} = require('../actions')
const k = require('../../../lib/constants/stateManagement')
const fs = require('fs')
const windowManager = require('electron-window-manager')
const { internalEmitter } = require('electron-window-manager')
const store = windowManager.sharedData.fetch('store')

ipcMain.on(k.PUBLISH, async (event, load) => {
  debug('%s heard', k.PUBLISH)
  const { password } = store.account
  try {
    internalEmitter.emit(k.CHANGE_PENDING_TRANSACTION_STATE, true)

    let dispatchLoad = { load: { fileName: load.name } }
    dispatch({ type: k.FEED_MODAL, load: dispatchLoad })
    windowManager.openModal('generalPleaseWaitModal')

    let { afs: newAFS, afs: { did } } = await afs.create({ owner: load.userAid, password })
    await newAFS.close();
    await (await afs.add({ did, paths: load.paths, password })).close()

    const size = load.paths.reduce((sum, file) => sum += fs.statSync(file).size, 0)
    await actionsUtil.writeFileMetaData({ did, size, title: load.name, password })

    debug('Estimating deploy proxy cost')
    const deployCost = await afs.deploy({ password, did, estimate: true })
    const ethAmount = await araContractsManager.getEtherBalance(store.account.accountAddress)
    if (ethAmount < deployCost) {
      throw new Error('Not enouth eth')
    }

    debug('Deploying proxy')
    await afs.deploy({ password, did })

    debug('Estimating gas')
    const commitEstimate = await afs.commit({ did, password, price: Number(load.price), estimate: true })
    let setPriceEstimate = 0
    if (load.price != null) {
      setPriceEstimate = await afs.setPrice({ did, password, price: Number(load.price), estimate: true })
    }
    const gasEstimate = Number(commitEstimate) + Number(setPriceEstimate)
    if (ethAmount < (deployCost + gasEstimate)) {
      throw new Error('Not enouth eth')
    }

    debug('Gas estimate: %s', gasEstimate)
    debug('Dispatching %s', k.FEED_MODAL)
    dispatchLoad = {
      did,
      gasEstimate,
      name: load.name,
      paths: load.paths,
      price: load.price ? load.price : 0,
      size
    }
    dispatch({ type: k.FEED_MODAL, load: dispatchLoad })
    windowManager.closeModal('generalPleaseWaitModal')
    windowManager.openModal('publishConfirmModal')
  } catch (err) {
    debug('Error publishing file %o:', err)
    internalEmitter.emit(k.CHANGE_PENDING_TRANSACTION_STATE, false)
    windowManager.closeModal('generalPleaseWaitModal')
    err === 'Not enough eth'
      ? dispatch({ type: k.FEED_MODAL, load: { modalName: 'failureModal2' } })
      : dispatch({ type: k.FEED_MODAL, load: { modalName: 'notEnoughEth' } })
    windowManager.openModal('generalMessageModal')
    return
  }
})

ipcMain.on(k.CONFIRM_PUBLISH, async (event, load) => {
  debug('%s heard', k.CONFIRM_PUBLISH)
  const { account, farmer } = store
  try {
    internalEmitter.emit(k.CHANGE_PENDING_TRANSACTION_STATE, true)
    acmManager.savePublishedItem(load.did, account.userAid)

    const descriptorOpts = {
      datePublished: new Date,
      name: load.name,
      owner: true,
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
    internalEmitter.emit(k.CHANGE_PENDING_TRANSACTION_STATE, false)

    const publishedSub = await araContractsManager.subscribePublished({ did: load.did })
    const rewardsSub = await araContractsManager.subscribeRewardsAllocated(load.did, account.accountAddress, account.userAid)
    dispatch({ type: k.ADD_PUBLISHED_SUB, load: { publishedSub, rewardsSub } })

    await farmerManager.joinBroadcast({ farmer: farmer.farm, did: load.did })

    debug('Dispatching %s', k.FEED_MODAL)
    dispatch({
      type: k.FEED_MODAL,
      load: { did: load.did, name: load.name }
    })
    windowManager.openModal('publishSuccessModal')
  } catch (err) {
    debug('Error in committing: %o', err)
    debug('Removing %s from .acm', load.did)

    acmManager.removedPublishedItem(load.did, account.userAid)
    dispatch({ type: k.ERROR_PUBLISHING })

    internalEmitter.emit(k.CHANGE_PENDING_TRANSACTION_STATE, false)
    windowManager.closeModal('generalPleaseWaitModal')
    //Needs short delay. Race conditions cause modal state to dump after its loaded
    setTimeout(() => {
      dispatch({ type: k.FEED_MODAL, load: { modalName: 'failureModal2' } })
      windowManager.openModal('generalMessageModal')
    }, 500)
  }
})
