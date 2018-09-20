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
  ESTIMATION,
  ESTIMATING_COST,
  FEED_MODAL,
  PUBLISH,
  PUBLISHED,
  PUBLISHING,
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
  } catch (err) {
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
        debug('Dispatching %s', PUBLISHED)
        windowManager.pingView({ view: 'filemanager', event: PUBLISHED })
        araContractsManager.savePublishedItem(load.did)
        araContractsManager.subscribePublished({ did: load.did })
        afsManager.unarchiveAFS({ did: load.did, path: afsManager.makeAfsPath(load.did) })
        dispatch({ type: CHANGE_BROADCASTING_STATE, load: true })
        afsManager.broadcast({ did: load.did })
      })
      .catch(debug)

    dispatch({
      type: PUBLISHING,
      load: {
        datePublished: '',
        did: load.did,
        downloadPercent: 0,
        earnings: 0,
        name: load.name,
        path: afsManager.makeAfsPath(load.did),
        peers: 0,
        price: load.price,
        size: load.size,
        status: PUBLISHING
      }
    })

    windowManager.pingView({ view: 'filemanager', event: PUBLISHING })
    windowManager.get('publishFileView').close()
  } catch (err) {
    debug('Error: %O', err)
  }
})
