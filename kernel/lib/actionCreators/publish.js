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
  GOT_PUBLISHED_SUB,
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
        debug('Dispatching %s', PUBLISHED)
        dispatch({ type: PUBLISHED, load: araBalance })

        const subscription = await araContractsManager.subscribePublished({ meta: { aid: load.did }})
        debug('Dispatching %s', GOT_PUBLISHED_SUB)
        dispatch({ type: GOT_PUBLISHED_SUB , load: subscription })

        debug('Pinging Filemanager with %s', PUBLISHED)
        windowManager.pingView({ view: 'filemanager', event: PUBLISHED })

        araContractsManager.savePublishedItem(load.did)
        afsManager.unarchiveAFS({ did: load.did, path: afsManager.makeAfsPath(load.did) })
        afsManager.broadcast({ did: load.did })
      })
      .catch(debug)

    debug('Dispatching %s %s', PUBLISHING, load.did)
    dispatch({ type: PUBLISHING, load: afsManager.descriptorGenerator(load.did) })

    windowManager.pingView({ view: 'filemanager', event: PUBLISHING })
    windowManager.get('publishFileView').close()
  } catch (err) {
    debug('Error: %O', err)
  }
})