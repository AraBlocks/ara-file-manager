const debug = require('debug')('afm:kernel:lib:actionCreators:publish')
const afs = require('ara-filesystem')
const cfsnetenv = require('cfsnet/env')
const dispatch = require('../reducers/dispatch')
const { ipcMain } = require('electron')
const {
  afmManager,
  afsManager,
  acmManager,
  utils: actionsUtil,
  descriptorGeneration
} = require('../actions')
const k = require('../../../lib/constants/stateManagement')
const fs = require('fs')
const windowManager = require('electron-window-manager')
const { internalEmitter } = require('electron-window-manager')
const store = windowManager.sharedData.fetch('store')
const { resolve } = require('path')

ipcMain.on(k.DEPLOY_PROXY, _deployProxy)

internalEmitter.on(k.DEPLOY_PROXY, _deployProxy)

ipcMain.on(k.DEPLOY_CFS, () => {
  console.log("MAddie HY")

  dispatch({
    type: k.FEED_MANAGE_FILE,
    load: {
      type: 'free',
      name: '',
      fileList: []
    }
  })
  windowManager.openWindow('manageFileView')

  windowManager.pingView({ view: 'manageFileView', event: k.REFRESH })
})

async function _deployProxy() {
  debug('%s heard', k.DEPLOY_PROXY)
  const { account, files } = store

  //Checks published files to see if any haven't been committed. If true, skips deploying proxy and uses that afs to publish
  try {
    const unpublishedAFS = files.published.find(({ status }) => status === k.UNCOMMITTED)
    if (unpublishedAFS) {
      dispatch({
        type: k.FEED_MANAGE_FILE,
        load: {
          did: unpublishedAFS.did,
          price: 0,
          name: '',
          fileList: [],
          uncommitted: true
        }
      })
      windowManager.openWindow('manageFileView')
      return
    }

    dispatch({ type: k.FEED_ESTIMATE_SPINNER, load: { type: 'deploy' }})
    windowManager.openWindow('estimateSpinner')

    const estimate = await afs.deploy({ password: account.password, did: account.deployEstimateDid, estimate: true })
    const ethAmount = await acmManager.getEtherBalance(store.account.accountAddress)

    if (ethAmount < estimate) { throw new Error('Not enough eth') }

    windowManager.pingView({ view: 'estimateSpinner', event: k.REFRESH, load: { estimate } })
  } catch (err) {
    debug('Error getting estimate for deploying proxy %o:', err)

    windowManager.closeWindow('estimateSpinner')
    errorHandling(err)
  }
}

async function makeCFS(farmer, opts) {
  cfsnetenv.CFS_ROOT_DIR = opts.cfsRootDir || afmManager.getCFSDir()
  const cfs = await farmer.farm.fs.create(opts)
  return cfs
}

ipcMain.on(k.CONFIRM_DEPLOY_PROXY, async (event, load) => {
  debug('%s heard', k.CONFIRM_DEPLOY_PROXY)

  const { autoQueue, password, userDID } = store.account
  try {
    internalEmitter.emit(k.CHANGE_PENDING_PUBLISH_STATE, true)

    dispatch({ type: k.FEED_MODAL, load: { modalName: 'deployingProxy' } })
    windowManager.openModal('generalPleaseWaitModal')

    let { afs: newAfs, afs: { did }, mnemonic } = await afs.create({ owner: userDID, password })
    await newAfs.close()

    await autoQueue.push(() => afs.deploy({ password, did }))

    const descriptor = await descriptorGeneration.makeDescriptor(did, { owner: true, status: k.UNCOMMITTED })

    windowManager.closeWindow('generalPleaseWaitModal')

    dispatch({
      type: k.PROXY_DEPLOYED,
      load: {
        contentDID: did,
        mnemonic,
        userDID,
        isAFS: true,
        descriptor
      }
    })

    windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
    windowManager.openModal('mnemonicWarning')
  } catch (err) {
    debug('Error deploying proxy %o:', err)
    errorHandling(err)
  }
})

ipcMain.on(k.PUBLISH, async (event, load) => {
  debug('%s heard', k.PUBLISH)
  const { farmer } = store
  const did = load.did
  try {
    // create cfs
    try {
      const cfs = await makeCFS(farmer, { id: load.name })

      // cfs add ...

      Object.assign(load, { did: cfs.key })
      internalEmitter.emit(k.START_SEEDING, load)
    } catch (e) {
      debug('k.PUBLISH error', e)
    }
    windowManager.openModal('publishConfirmModal')
  } catch (err) {
    debug('Error publishing file %o:', err)

    internalEmitter.emit(k.CHANGE_PENDING_PUBLISH_STATE, false)
    windowManager.closeModal('generalPleaseWaitModal')
    errorHandling(err)

    return
  }
})

ipcMain.on(k.CONFIRM_PUBLISH, async (event, load) => {
  debug('%s heard', k.CONFIRM_PUBLISH)
  const {
    accountAddress,
    autoQueue,
    password,
    userDID
  } = store.account

  let oldStatus
  try {
    internalEmitter.emit(k.CHANGE_PENDING_PUBLISH_STATE, true)

    oldStatus = store.files.published[store.files.published.length - 1].status

    const descriptorOpts = {
      datePublished: new Date,
      name: load.name,
      owner: true,
      price: Number(load.price),
      size: load.size,
      status: k.PUBLISHING
    }

    //makeDescriptor takes a little time and causes lag. Dispatch this first to indicate response in UI
    dispatch({ type: k.PUBLISHING, load: { did: load.did, ...descriptorOpts } })
    windowManager.pingView({ view: 'filemanager', event: k.REFRESH })

    const descriptor = await descriptorGeneration.makeDescriptor(load.did, descriptorOpts)
    dispatch({ type: k.PUBLISHING, load: descriptor })
    windowManager.pingView({ view: 'filemanager', event: k.REFRESH })

    await autoQueue.push(() => afs.commit({ did: load.did, price: Number(load.price), password: password }))
    const balance = await acmManager.getAraBalance(userDID)
    windowManager.pingView({ view: 'filemanager', event: k.REFRESH })

    debug('Dispatching %s', k.PUBLISHED)
    dispatch({ type: k.PUBLISHED, load: { balance, did: load.did } })
    internalEmitter.emit(k.CHANGE_PENDING_PUBLISH_STATE, false)

    debug('Dispatching %s', k.FEED_MODAL)
    dispatch({
      type: k.FEED_MODAL,
      load: { did: load.did, name: load.name }
    })
    windowManager.openModal('publishSuccessModal')

    const publishedSub = await acmManager.subscribePublished({ did: load.did })
    const rewardsSub = await acmManager.subscribeRewardsAllocated(load.did, accountAddress, userDID)
    dispatch({ type: k.ADD_PUBLISHED_SUB, load: { publishedSub, rewardsSub } })
    dispatch({ type: k.ADD_PUBLISHED_SUB, load: { publishedSub, rewardsSub } })
console.log('CONFIRM_PUBLISH')
console.log('load', load)
    internalEmitter.emit(k.START_SEEDING, load)
  } catch (err) {
    debug('Error in committing: %o', err)
    debug('Removing %s from .acm', load.did)

    dispatch({ type: k.ERROR_PUBLISHING, load: { oldStatus } })

    internalEmitter.emit(k.CHANGE_PENDING_PUBLISH_STATE, false)
    windowManager.closeModal('generalPleaseWaitModal')
    //Needs short delay. Race conditions cause modal state to dump after its loaded
    setTimeout(() => {
      dispatch({ type: k.FEED_MODAL, load: { modalName: 'failureModal2' } })
      windowManager.openModal('generalMessageModal')
    }, 500)
  }
})

function errorHandling(err) {
  err.message === 'Not enough eth'
    ? dispatch({ type: k.FEED_MODAL, load: { modalName: 'notEnoughEth' } })
    : dispatch({ type: k.FEED_MODAL, load: { modalName: 'failureModal2' } })
  windowManager.openModal('generalMessageModal')
}
