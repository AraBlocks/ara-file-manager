'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:utils')
const dispatch = require('../reducers/dispatch')
const k = require('../../../lib/constants/stateManagement')
const { afsManager, farmerManager } = require('../actions')
const { ipcMain } = require('electron')
const windowManager = require('electron-window-manager')
const { internalEmitter } = require('electron-window-manager')
const { switchPendingTransactionState } = require('../../../boot/tray')
const store = windowManager.sharedData.fetch('store')

ipcMain.on(k.CLEAN_UI, () => {
  debug('%s heard', k.CLEAN_UI)
  dispatch({ type: k.CLEAN_UI })
  windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
})

ipcMain.on(k.OPEN_AFS, async (event, load) => {
  try {
    debug('%s heard', k.OPEN_AFS)
    const { farmer } = store
    dispatch({ type: k.CHANGE_BROADCASTING_STATE, load: { did: load.did, shouldBroadcast: false } })
    await farmerManager.unjoinBroadcast({ farmer: farmer.farm, did: load.did })
    dispatch({ type: k.FEED_CONTENT_VIEWER, load: { ...load, fileList: [] }})
    windowManager.openWindow('afsExplorerView')
    const fileList = await afsManager.getFileList(load.did)
    dispatch({ type: k.FEED_CONTENT_VIEWER, load: { ...load, fileList }})
    windowManager.pingView({ view: 'afsExplorerView', event: k.REFRESH })
  } catch(err) {
    debug("Error: %o", err)
  }
})