'use strict'

const debug = require('debug')('afm:boot:squirrel')
const dispatch = require('../kernel/redux/reducers/dispatch')
const { version } = require('../package.json')
const { urls, stateManagement: k } = require('k')
const { autoUpdater } = require('electron')
const isDev = require('electron-is-dev')
const windowManager = require('electron-window-manager')

if (isDev) { return }

process.platform === 'darwin'
  ? autoUpdater.setFeedURL(urls.SQUIRREL_MAC + '?v=' + version)
  : autoUpdater.setFeedURL(urls.SQUIRREL_WIN)

autoUpdater.addListener('checking-for-update', () => {
  debug('checking-for-updates 🐿')
})

autoUpdater.addListener('update-available', () => {
  debug('update-available')
})

autoUpdater.addListener('update-not-available', () => {
  debug('update-not-available')
})

autoUpdater.addListener('update-downloaded', () => {
  debug('update-downloaded')
  dispatch({ type: k.FEED_MODAL, load: {
    modalName: 'updateApplication',
    callback: () => autoUpdater.quitAndInstall()
  }})
  windowManager.openModal('generalActionModal')
})

autoUpdater.addListener('error', (error) => {
  debug('squirrel error: %o', error)
})

autoUpdater.checkForUpdates()