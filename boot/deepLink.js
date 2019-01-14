'use strict'

const { app, dialog } = require('electron')
const windowManager = require('electron-window-manager')

module.exports = {
  handleDeepLink(event, url) {
    event.preventDefault()
    global.deepLinkingUrl = url
    if (app.isReady()) { windowManager.openDeepLinking(url) }
  },

  deeplinkWaiting() {
    if (process.platform == 'win32') { global.deepLinkingUrl = process.argv[1] }
    if (global.deepLinkingUrl) {
      windowManager.openDeepLinking(global.deepLinkingUrl)
      return true
    }

    return false
  }
}