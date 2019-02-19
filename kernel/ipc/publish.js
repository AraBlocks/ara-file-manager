const debug = require('debug')('afm:kernel:lib:actionCreators:publish')
const afs = require('ara-filesystem')
const dispatch = require('../state/dispatch')
const { ipcMain } = require('electron')
const {
  fs: afsManager,
  acm: acmManager,
  utils: actionsUtil,
} = require('../daemons')
const { fileDescriptor: descriptorGenerator } = require('../util')
const { events: k } = require('k')
const fs = require('fs')
const windowManager = require('electron-window-manager')
const { internalEmitter } = require('electron-window-manager')
const store = windowManager.sharedData.fetch('store')

ipcMain.on(k.DEPLOY_PROXY, _deployProxy)

internalEmitter.on(k.DEPLOY_PROXY, _deployProxy)

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
  const { password } = store.account
  const did = load.did
  try {
    let dispatchLoad = { load: { fileName: load.name } }
    dispatch({ type: k.FEED_MODAL, load: dispatchLoad })
    windowManager.openModal('generalPleaseWaitModal')
    windowManager.closeWindow('manageFileView')

    await afsManager.removeAllFiles({ did, password })
    await (await afs.add({ did, paths: load.paths, password })).close()

    const size = load.paths.reduce((sum, file) => sum += fs.statSync(file).size, 0)

    await actionsUtil.writeFileMetaData({ did, size, title: load.name, password })
    const ethAmount = await acmManager.getEtherBalance(store.account.accountAddress)

    const commitEstimate = await afs.commit({ did, password, price: Number(load.price), estimate: true })
    let setPriceEstimate = 0
    if (load.price) {
      setPriceEstimate = await afs.setPrice({ did, password, price: Number(load.price), estimate: true })
    }
    const gasEstimate = Number(commitEstimate) + Number(setPriceEstimate)
    if (ethAmount < gasEstimate) { throw new Error('Not enough eth') }

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