'use strict'

const AccountInfo = require('../views/accountInfo')
const { ipcRenderer, remote } = require('electron')
const { REFRESH } = require('../../lib/constants/stateManagement')
const windowManager = remote.require('electron-window-manager')
const store = windowManager.sharedData.fetch('store')
const isDev = require('electron-is-dev')

const accountInfo = new AccountInfo(store)
document.getElementById('container').appendChild(accountInfo.render(store))

ipcRenderer.on(REFRESH, () => accountInfo.render(store))

isDev && Object.assign(window, { store })