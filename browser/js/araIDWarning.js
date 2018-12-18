'use strict'

const ARAIDWarning = require('../views/araIDWarning')
const { remote } = require('electron')
const windowManager = remote.require('electron-window-manager')
const store = windowManager.sharedData.fetch('store')

const { account } = store
const araIDWarning = new ARAIDWarning({ ...account })
document.getElementById('container').appendChild(araIDWarning.render())