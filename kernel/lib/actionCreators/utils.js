'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:utils')
const dispatch = require('../reducers/dispatch')
const k = require('../../../lib/constants/stateManagement')
const { afsManager, utils } = require('../actions')
const { ipcMain, shell } = require('electron')
const windowManager = require('electron-window-manager')

ipcMain.on(k.CLEAN_UI, () => {
  debug('%s heard', k.CLEAN_UI)
  dispatch({ type: k.CLEAN_UI })
  windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
})

ipcMain.on(k.OPEN_AFS, async (event, load) => {
  debug('%s heard', k.OPEN_AFS)
  shell.openItem(utils.makeAfsPath(load.did))
  const fileList = await afsManager.getFileList(load.did)
  console.log(fileList)
  dispatch({ type: k.FEED_CONTENT_VIEWER, load: load })
})