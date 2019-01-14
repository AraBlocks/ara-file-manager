'use strict'

const { app } = require('electron')
const { openDeepLinking } = require('electron-window-manager')

const shouldQuit = app.makeSingleInstance((argv, workingDirectory) => {
  if (process.platform === 'win32') {
    const deeplink = argv[1]
    if (deeplink) { openDeepLinking(deeplink) }
  }
})

if (shouldQuit) { return app.quit() }