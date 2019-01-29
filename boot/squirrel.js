'use strict'

const { autoUpdater, dialog } = require('electron')
const { version } = require('../package.json')
const { urls } = require('k')
const isDev = require('electron-is-dev')
const dispatch = require('../kernel/redux/reducers/dispatch')
const windowManager = require('electron-window-manager')

if (isDev === false && process.platform === 'darwin') {
  const updateFeed = urls.SQUIRREL_MAC

  autoUpdater.setFeedURL(updateFeed + '?v=' + version)

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

    dispatch({ type: 'FEED_MODAL', load: { modalName: 'appUpdateAvailable', callback: autoUpdater.quitAndInstall } })
    windowManager.openModal('generalActionModal')
  })

  autoUpdater.addListener('error', (error) => {
    dialog.showMessageBox({ 'message': 'Auto updater error: ' + error })
  })

  autoUpdater.checkForUpdates()
}