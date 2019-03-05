const debug = require('debug')('ara:fm:kernel:ipc:publish')

const araFilesystem = require('ara-filesystem')
const { ipcMain } = require('electron')
const { events } = require('k')
const fs = require('fs')
const windowManager = require('electron-window-manager')

const {
  afs,
  act,
  utils: daemonsUtil,
  descriptorGeneration
} = require('../daemons')
const dispatch = require('../redux/reducers/dispatch')

const { internalEmitter } = windowManager
const store = windowManager.sharedData.fetch('store')

ipcMain.on(events.DEPLOY_PROXY, _deployProxy)

internalEmitter.on(events.DEPLOY_PROXY, _deployProxy)

async function _deployProxy() {
  debug('%s heard', events.DEPLOY_PROXY)
  const { account, files } = store

  //Checks published files to see if any haven't been committed. If true, skips deploying proxy and uses that afs to publish
  try {
    const unpublishedAFS = files.published.find(({ status }) => status === events.UNCOMMITTED)
    if (unpublishedAFS) {
      dispatch({
        type: events.FEED_MANAGE_FILE,
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

    dispatch({ type: events.FEED_ESTIMATE_SPINNER, load: { type: 'deploy' } })
    windowManager.openWindow('estimateSpinner')

    const estimate = await araFilesystem.deploy({ password: account.password, did: account.deployEstimateDid, estimate: true })
    const ethAmount = await act.getEtherBalance(store.account.accountAddress)

    if (ethAmount < estimate) { throw new Error('Not enough eth') }

    windowManager.pingView({ view: 'estimateSpinner', event: events.REFRESH, load: { estimate } })
  } catch (err) {
    debug('Error getting estimate for deploying proxy %o:', err)

    windowManager.closeWindow('estimateSpinner')
    errorHandling(err)
  }
}

ipcMain.on(events.CONFIRM_DEPLOY_PROXY, async () => {
  debug('%s heard', events.CONFIRM_DEPLOY_PROXY)

  const { autoQueue, password, userDID } = store.account
  try {
    internalEmitter.emit(events.CHANGE_PENDING_PUBLISH_STATE, true)

    dispatch({ type: events.FEED_MODAL, load: { modalName: 'deployingProxy' } })
    windowManager.openModal('generalPleaseWaitModal')

    let { afs: newAfs, afs: { did }, mnemonic } = await araFilesystem.create({ owner: userDID, password })
    await newAfs.close()

    await autoQueue.push(() => araFilesystem.deploy({ password, did }))

    const descriptor = await descriptorGeneration.makeDescriptor(did, { owner: true, status: events.UNCOMMITTED })

    windowManager.closeWindow('generalPleaseWaitModal')

    dispatch({
      type: events.PROXY_DEPLOYED,
      load: {
        contentDID: did,
        mnemonic,
        userDID,
        isAFS: true,
        descriptor
      }
    })

    windowManager.pingView({ view: 'filemanager', event: events.REFRESH })
    windowManager.openModal('mnemonicWarning')
  } catch (err) {
    debug('Error deploying proxy %o:', err)
    errorHandling(err)
  }
})

ipcMain.on(events.PUBLISH, async (event, load) => {
  debug('%s heard', events.PUBLISH)
  const { password } = store.account
  const did = load.did
  try {
    let dispatchLoad = { load: { fileName: load.name } }
    dispatch({
      type: events.FEED_MODAL,
      load: { modalName: 'publishEstimate', ...dispatchLoad }
    })
    windowManager.openModal('generalPleaseWaitModal')
    windowManager.closeWindow('manageFileView')

    await afs.removeAllFiles({ did, password })
    await (await araFilesystem.add({ did, paths: load.paths, password })).close()

    const size = load.paths.reduce((sum, file) => sum += fs.statSync(file).size, 0)

    await daemonsUtil.writeFileMetaData({ did, size, title: load.name, password })
    const ethAmount = await act.getEtherBalance(store.account.accountAddress)

    const commitEstimate = await araFilesystem.commit({ did, password, price: Number(load.price), estimate: true })
    let setPriceEstimate = 0
    if (load.price) {
      setPriceEstimate = await araFilesystem.setPrice({ did, password, price: Number(load.price), estimate: true })
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
    dispatch({
      type: events.FEED_MODAL,
      load: { modalName: 'publishNow', ...dispatchLoad }
    })

    windowManager.closeModal('generalPleaseWaitModal')
    windowManager.openModal('publishConfirmModal')
  } catch (err) {
    debug('Error publishing file %o:', err)

    internalEmitter.emit(events.CHANGE_PENDING_PUBLISH_STATE, false)
    windowManager.closeModal('generalPleaseWaitModal')
    errorHandling(err)

    return
  }
})

ipcMain.on(events.CONFIRM_PUBLISH, async (event, load) => {
  debug('%s heard', events.CONFIRM_PUBLISH)
  const {
    accountAddress,
    autoQueue,
    password,
    userDID
  } = store.account

  let oldStatus
  try {
    internalEmitter.emit(events.CHANGE_PENDING_PUBLISH_STATE, true)

    oldStatus = store.files.published[store.files.published.length - 1].status

    const descriptorOpts = {
      datePublished: new Date,
      name: load.name,
      owner: true,
      price: Number(load.price),
      size: load.size,
      status: events.PUBLISHING
    }

    //makeDescriptor takes a little time and causes lag. Dispatch this first to indicate response in UI
    dispatch({ type: events.PUBLISHING, load: { did: load.did, ...descriptorOpts } })
    windowManager.pingView({ view: 'filemanager', event: events.REFRESH })

    const descriptor = await descriptorGeneration.makeDescriptor(load.did, descriptorOpts)
    dispatch({ type: events.PUBLISHING, load: descriptor })
    windowManager.pingView({ view: 'filemanager', event: events.REFRESH })

    await autoQueue.push(() => araFilesystem.commit({ did: load.did, price: Number(load.price), password: password }))
    const balance = await act.getAraBalance(userDID)
    windowManager.pingView({ view: 'filemanager', event: events.REFRESH })

    debug('Dispatching %s', events.PUBLISHED)
    dispatch({ type: events.PUBLISHED, load: { balance, did: load.did } })
    internalEmitter.emit(events.CHANGE_PENDING_PUBLISH_STATE, false)

    debug('Dispatching %s', events.FEED_MODAL)
    dispatch({
      type: events.FEED_MODAL,
      load: { did: load.did, name: load.name }
    })
    windowManager.openModal('publishSuccessModal')

    const publishedSub = await act.subscribePublished({ did: load.did })
    const rewardsSub = await act.subscribeRewardsAllocated(load.did, accountAddress, userDID)
    dispatch({ type: events.ADD_PUBLISHED_SUB, load: { publishedSub, rewardsSub } })

    internalEmitter.emit(events.START_SEEDING, load)
  } catch (err) {
    debug('Error in committing: %o', err)
    debug('Removing %s from .act', load.did)

    dispatch({ type: events.ERROR_PUBLISHING, load: { oldStatus } })

    internalEmitter.emit(events.CHANGE_PENDING_PUBLISH_STATE, false)
    windowManager.closeModal('generalPleaseWaitModal')
    //Needs short delay. Race conditions cause modal state to dump after its loaded
    setTimeout(() => {
      dispatch({ type: events.FEED_MODAL, load: { modalName: 'failureModal2' } })
      windowManager.openModal('generalMessageModal')
    }, 500)
  }
})

function errorHandling(err) {
  err.message === 'Not enough eth'
    ? dispatch({ type: events.FEED_MODAL, load: { modalName: 'notEnoughEth' } })
    : dispatch({ type: events.FEED_MODAL, load: { modalName: 'failureModal2' } })
  windowManager.openModal('generalMessageModal')
}
