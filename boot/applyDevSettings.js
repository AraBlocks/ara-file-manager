'use strict'

const isDev = require('electron-is-dev')
const { globalShortcut } = require('electron')
const path = require('path')
const windowManager = require('electron-window-manager')

if (isDev) {
  //Creates dev views
  require('./ipc-dev')

  //Hot reloads browser side changes
  require('electron-reload')(path.resolve(__dirname, '..', 'browser'))

  //Registers command/control + \ to open dev tools
  globalShortcut.register('CommandOrControl+\\', () => {
    try { windowManager.getCurrent().object.openDevTools() } catch (e) { }
  })

  //Registers command/control + \ to refresh window
  globalShortcut.register('CommandOrControl+r', () => {
    try { windowManager.getCurrent().object.reload() } catch (e) { }
  })
}