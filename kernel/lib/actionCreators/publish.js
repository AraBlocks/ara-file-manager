'use strict'

const { publish } = require('../actions')
const { ESTIMATION, ESTIMATING_COST, PUBLISH} = require('../../../lib/constants/stateManagement')
const windowManager = require('electron-window-manager')

windowManager.bridge.on(PUBLISH, async (load) => {
  console.log({load})
  windowManager.bridge.emit(ESTIMATING_COST)

  const estimate = await publish(load)
  console.log({estimate})
  windowManager.bridge.emit(ESTIMATION, estimate)
  // windowManager.bridge.emit(PUBLISHED, response)
})