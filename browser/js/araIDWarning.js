'use strict'

const ARAIDWarning = require('../views/ARAIDWarning')
const { remote } = require('electron')
const windowManager = remote.require('electron-window-manager')
const store = windowManager.sharedData.fetch('store')

const { modal } = store
const araIDWarning = new ARAIDWarning(modal.data)
document.getElementById('container').appendChild(araIDWarning.render())