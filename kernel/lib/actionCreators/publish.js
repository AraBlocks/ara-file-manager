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
  CONFIRM_PUBLISH,
  ESTIMATION,
  ESTIMATING_COST,
  FEED_MODAL,
  PUBLISH,
  PUBLISHED,
  PUBLISHING,
  UPLOAD_COMPLETE
} = require('../../../lib/constants/stateManagement')
const windowManager = require('electron-window-manager')
const store = windowManager.sharedData.fetch('store')

ipcMain.on(PUBLISH, async (event, load) => {
  debug('%s heard. Load: %O', PUBLISH, load)
  try {
    event.sender.send(ESTIMATING_COST)

    const estimate = await publish.addCreateEstimate(load)
    debug('Dispatching %s . Load: %O', FEED_MODAL, estimate)
    dispatch({ type: FEED_MODAL, load: estimate })

    event.sender.send(ESTIMATION)
  } catch(err) {
    debug('Error: %O', err)
  }
})

ipcMain.on(CONFIRM_PUBLISH, async (event, load) => {
  debug('%s heard. Load: %o', CONFIRM_PUBLISH, load)
  const {
    account: {
      accountAddress,
      password
    }
  } = store
  try {
    publish.commit({ ...load, password })
      .then(async () => {
        const araBalance = await araContractsManager.getAraBalance(accountAddress)
        dispatch({ type: PUBLISHED, load: araBalance })
        debug('Dispatch %s . Load: %s', PUBLISHED, araBalance)
        windowManager.pingView({ view: 'filemanager', event: PUBLISHED })
        araContractsManager.savePublishedItem(load.did)
        afsManager.unarchiveAFS({ did: load.did, path: afsManager.makeAfsPath(load.did) })
        afsManager.broadcast({ did: load.did })
      })
      .catch(debug)

    dispatch({
      type: PUBLISHING,
      load: {
        downloadPercent: 0,
        meta: {
          aid: load.did,
          datePublished: '',
          earnings: 0,
          peers: 0,
          price: load.price,
        },
        name: load.name,
        size: load.size,
        status: PUBLISHING,
        path: afsManager.makeAfsPath(load.did)
      }
    })

    windowManager.pingView({ view: 'filemanager', event: PUBLISHING })
    windowManager.get('publishFileView').close()
  } catch (err) {
    debug('Error: %O', err)
  }
})