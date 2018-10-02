'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:publish')
const dispatch = require('../reducers/dispatch')
const { ipcMain } = require('electron')
const {
  afsManager,
  araContractsManager,
  publish
} = require('../actions')
const {
  CHANGE_BROADCASTING_STATE,
  CONFIRM_PUBLISH,
  ERROR_PUBLISHING,
  ESTIMATION,
  ESTIMATING_COST,
  FEED_MODAL,
  OPEN_MODAL,
  PUBLISH,
  PUBLISHED,
  PUBLISHING,
  REFRESH,
} = require('../../../lib/constants/stateManagement')
const windowManager = require('electron-window-manager')
const { internalEmitter } = require('../../lib/lsWindowManager')
const store = windowManager.sharedData.fetch('store')

ipcMain.on(PUBLISH, async (event, load) => {
  debug('%s heard. Load: %O', PUBLISH, load)
  try {
    event.sender.send(ESTIMATING_COST)

    const estimate = await publish.addCreateEstimate(load)
    if (estimate == null) {
      dispatch({ type: FEED_MODAL, load: { modalName: 'failureModal2' } })
      internalEmitter.emit(OPEN_MODAL, 'generalMessageModal')
      windowManager.closeWindow('publishFileView')
      return
    }
    debug('Dispatching %s . Load: %O', FEED_MODAL, estimate)
    dispatch({ type: FEED_MODAL, load: estimate })

    event.sender.send(ESTIMATION)
  } catch (err) {
    debug('Error: %O', err)
  }
})

ipcMain.on(CONFIRM_PUBLISH, async (event, load) => {
  debug('%s heard. Load: %o', CONFIRM_PUBLISH, load)
  const { account } = store
  try {
    araContractsManager.savePublishedItem(load.did)
    const descriptor = await afsManager.descriptorGeneratorPublishing({ ...load })
    dispatch({ type: PUBLISHING, load: descriptor })

    windowManager.pingView({ view: 'filemanager', event: REFRESH })
    windowManager.closeWindow('publishFileView')

    await publish.commit({ ...load, password: account.password })
    const araBalance = await araContractsManager.getAraBalance(account.userAid)
    debug('Dispatching %s', PUBLISHED)
    dispatch({ type: PUBLISHED, load: araBalance })
    windowManager.pingView({ view: 'filemanager', event: REFRESH })

    araContractsManager.subscribePublished({ did: load.did })
    afsManager.unarchiveAFS({ did: load.did, path: afsManager.makeAfsPath(load.did) })

    debug('Dispatching %s', CHANGE_BROADCASTING_STATE)
    dispatch({ type: CHANGE_BROADCASTING_STATE, load: true })
    afsManager.broadcast({ farmer: store.farmer.farm, did: load.did })

  } catch (err) {
    debug('Error in committing: %o', err)
    debug('Removing %s from .acm', load.did)

    araContractsManager.removedPublishedItem(load.did)
    dispatch({ type: ERROR_PUBLISHING })

    windowManager.pingView({ view: 'filemanager', event: REFRESH })
    //Needs short delay. Race conditions cause modal state to dump after its loaded
    setTimeout(() => {
      dispatch({ type: FEED_MODAL, load: { modalName: 'failureModal2' } })
      internalEmitter.emit(OPEN_MODAL, 'generalMessageModal')
    }, 500)
  }
})
