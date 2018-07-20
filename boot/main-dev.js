'use strict'

const { app } = require('electron')
const windowManager = require('../kernel/lib/lsWindowManager')
const isDev = require('electron-is-dev')
const path = require('path')
require('./ipc-dev')

app.on('ready', () => {
  windowManager.init()
  windowManager.sharedData.set('store', require('./store'))
  if (isDev) {
    require('electron-reload')(path.resolve('browser'))
    if (process.argv.includes('loggedin')) {
      const { dispatch } = require('../browser/lib/store/windowManagement')
      const { osxSurfaceAids } = require('../browser/lib/store/accountSelection')
      const { resolveAid } = require('../browser/lib/store/authentication')

      dispatch('login', resolveAid(osxSurfaceAids()[0]))
    }
  }
  require('./tray')()
})

app.on('window-all-closed', () =>{})