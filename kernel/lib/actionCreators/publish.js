'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:publish')
const dispatch = require('../reducers/dispatch')
const { makeAfsPath } = require('../actions/afsManager')
const { ipcMain } = require('electron')
const { afsManager, publish } = require('../actions')
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
  debug('%s heard. Load: %O', CONFIRM_PUBLISH, load)
  const { account: { aid } } = windowManager.sharedData.fetch('store')
  const { password } = aid
  try {
    debug('Committing AFS')
    publish.commit({ ...load, password })
      .then(() => {
        debug('Dispatch %s . Load: %s', PUBLISHED, load.cost)
        dispatch({ type: PUBLISHED, load: load.cost })
        fileManagerOpen() && windowManager.get('filemanager').object.webContents.send(PUBLISHED)
        afsManager.unarchiveAFS({ did: load.did, path: afsManager.makeAfsPath(load.did) })
        // afsManager.broadcast(
        //   load.did,
        //   () => {
        //     dispatch({ type: UPLOAD_COMPLETE, load: load.price})
        //     windowManager.get('filemanager') && windowManager.get('filemanager').object.webContents.send(UPLOAD_COMPLETE)
        //   }
        // )
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
        size: 1.67,
        status: 3,
        path: makeAfsPath(load.did)
      }
    })

    fileManagerOpen() && windowManager.get('filemanager').object.webContents.send(PUBLISHING)
    windowManager.get('publishFileView').close()
  } catch (err) {
    debug('Error: %O', err)
  }
})

const fileManagerOpen = () => windowManager.get('filemanager')