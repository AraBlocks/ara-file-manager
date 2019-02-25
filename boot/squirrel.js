const debug = require('debug')('afm:boot:squirrel')

const { autoUpdater } = require('electron')
const isDev = require('electron-is-dev')
const { stateManagement: k, urls } = require('k')
const windowManager = require('electron-window-manager')

const dispatch = require('../kernel/redux/reducers/dispatch')
const { version } = require('../package.json')
dispatch({ type: k.FEED_MODAL, load: { modalName: 'updatedContracts' } })
setTimeout(windowManager.openModal, 1500, 'generalMessageModal')
if (isDev) { return }

process.platform === 'darwin'
  ? autoUpdater.setFeedURL(urls.SQUIRREL_MAC + '?v=' + version)
  : autoUpdater.setFeedURL(urls.SQUIRREL_WIN)

autoUpdater.addListener('checking-for-update', () => {
  debug('checking-for-updates 🐿')
})

autoUpdater.addListener('update-available', () => {
  debug('update-available')
  const [, minor, patch] = version.split('.')
  if (minor === '9' && patch === '6') {
    dispatch({ type: k.FEED_MODAL, load: { modalName: 'updatedContracts' } })
    setTimeout(windowManager.openModal, 1500, 'generalMessageModal')
  }
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