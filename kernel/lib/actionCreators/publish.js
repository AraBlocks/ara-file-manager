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
    .then(() => windowManager.get('fileManager').object.webContents.send(PUBLISHED))
    .catch(console.log)
  windowManager.get('fileManager').object.webContents.send(PUBLISHING)
})