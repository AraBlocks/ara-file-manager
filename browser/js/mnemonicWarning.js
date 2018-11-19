'use strict'

const MnemonicWarning = require('../views/mnemonicWarning')
const { remote } = require('electron')
const windowManager = remote.require('electron-window-manager')
const store = windowManager.sharedData.fetch('store')

const { modal } = store
const mnemonicWarning = new MnemonicWarning(modal.data)
document.getElementById('container').appendChild(mnemonicWarning.render())