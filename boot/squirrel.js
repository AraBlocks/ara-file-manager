const debug = require('debug')('afm:boot:squirrel')

const { autoUpdater } = require('electron')
const isDev = require('electron-is-dev')
const { urls } = require('k')

const { version } = require('../package.json')

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
})

autoUpdater.addListener('error', (error) => {
  debug('squirrel error: %o', error)
})

autoUpdater.checkForUpdates()