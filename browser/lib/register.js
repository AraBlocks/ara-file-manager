'use strict'

const { REGISTER } = require('../../lib/constants/stateManagement')
const { remote } = require('electron')
const windowManager = remote.require('electron-window-manager')

module.exports = () => windowManager.bridge.emit(REGISTER)