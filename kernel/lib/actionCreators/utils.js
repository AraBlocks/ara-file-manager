'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:utils')
const dispatch = require('../reducers/dispatch')
const { CLEAN_UI, REFRESH } = require('../../../lib/constants/stateManagement')
const { ipcMain } = require('electron')
const windowManager = require('electron-window-manager')

ipcMain.on(CLEAN_UI, () => {
  debug('%s heard', CLEAN_UI)
  dispatch({ type: CLEAN_UI })
  windowManager.pingView({ view: 'filemanager', event: REFRESH })
})