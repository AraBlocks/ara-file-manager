'use strict'

const dispatch = require('../reducers/dispatch')
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

windowManager.bridge.on(PUBLISH, async (load) => {
  windowManager.bridge.emit(ESTIMATING_COST)

  const estimate = await publish.addCreateEstimate(load)
  dispatch({ type: FEED_MODAL, load: estimate })
  windowManager.bridge.emit(ESTIMATION)
})

windowManager.bridge.on(CONFIRM_PUBLISH, async load => {
  const { account: { aid } } = windowManager.sharedData.fetch('store')
  const { password } = aid
  try {
    await publish.commit(Object.assign(load, { password }))
    windowManager.bridge.emit(PUBLISHED)
  } catch (err) {
    console.log({err})
  }
})