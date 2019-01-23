'use strict'

const { autoUpdater, dialog } = require('electron')
const { version } = require('../package.json')
const { urls } = require('k')
const isDev = require('electron-is-dev')

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
    const dialogOpts = {
      type: 'info',
      buttons: ['Restart', 'Later'],
      title: 'Application Update',
      message: 'Update available',
      detail: 'A new version has been downloaded. Restart the application and wait a few moments to apply the pupdates.'
    }

    dialog.showMessageBox(dialogOpts, (response) => {
      if (response === 0) autoUpdater.quitAndInstall()
    })
  })

  autoUpdater.addListener('error', (error) => {
    dialog.showMessageBox({ 'message': 'Auto updater error: ' + error })
  })

  autoUpdater.checkForUpdates()
}