'use strict'

const { publish } = require('../actions')
const { PUBLISH, PUBLISHED, PUBLISHING } = require('../../../lib/constants/stateManagement')
const windowManager = require('electron-window-manager')

windowManager.bridge.on(PUBLISH, async (load) => {
  windowManager.bridge.emit(PUBLISHING)
  const response = await publish(load)
  windowManager.bridge.emit(PUBLISHED, response)
})