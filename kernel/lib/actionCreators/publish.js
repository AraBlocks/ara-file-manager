'use strict'

const dispatch = require('../reducers/dispatch')
const { ipcMain } = require('electron')
const { publish } = require('../actions')
const {
  CONFIRM_PUBLISH,
  ESTIMATION,
  ESTIMATING_COST,
  FEED_MODAL,
  PUBLISH,
  PUBLISHED,
  PUBLISHING
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
  publish.commit(Object.assign(load, { password }))
    .then(() => {
      setTimeout(() => {
        dispatch({ type: PUBLISHED, load: null })
        windowManager.get('filemanager')
          ? windowManager.get('filemanager').object.webContents.send(PUBLISHED)
          : windowManager.get('fManagerView').object.webContents.send(PUBLISHED)
      }, 3000)
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
    }
  })

  windowManager.get('filemanager')
    ? windowManager.get('filemanager').object.webContents.send(PUBLISHING)
    : windowManager.get('fManagerView').object.webContents.send(PUBLISHING)

  windowManager.get('publishFileView').close()
})