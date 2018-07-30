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
  try {
    await publish.commit(Object.assign(load, { password }))
    windowManager.get('publishFileView').object.webContents.send(PUBLISHED)
  } catch (err) {
    console.log({err})
  }
})