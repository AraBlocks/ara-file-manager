'use strict'

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
  event.sender.send(ESTIMATING_COST)

  const estimate = await publish.addCreateEstimate(load)
  dispatch({ type: FEED_MODAL, load: estimate })
  event.sender.send(ESTIMATION)
})

ipcMain.on(CONFIRM_PUBLISH, async (event, load) => {
  const { account: { aid } } = windowManager.sharedData.fetch('store')
  const { password } = aid
  publish.commit({ ...load, password })
    .then(() => {
      dispatch({ type: PUBLISHED, load: load.cost })
      windowManager.get('filemanager').object.webContents.send(PUBLISHED)
      afsManager.unarchiveAFS({ did: load.did, path: afsManager.makeAfsPath(load.did) })
      afsManager.broadcast(
        load.did,
        () => {
          dispatch({ type: UPLOAD_COMPLETE, load: load.price})
          windowManager.get('filemanager').object.webContents.send(UPLOAD_COMPLETE)
        }
      )
    })
    .catch(console.log)

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

  windowManager.get('filemanager').object.webContents.send(PUBLISHING)
  windowManager.get('publishFileView').close()
})