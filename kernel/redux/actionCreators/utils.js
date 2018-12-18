'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:utils')
const k = require('../../../lib/constants/stateManagement')
const dispatch = require('../reducers/dispatch')
const {
  afsManager,
  afmManager,
  farmerManager
} = require('../actions')
const { ipcMain, app } = require('electron')
const windowManager = require('electron-window-manager')
const { internalEmitter } = require('electron-window-manager')
const store = windowManager.sharedData.fetch('store')

internalEmitter.on(k.CLEAN_UI, () => {
  debug('%s heard', k.CLEAN_UI)
  dispatch({ type: k.CLEAN_UI })
  windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
})

ipcMain.on(k.OPEN_AFS, async (event, load) => {
  try {
    debug('%s heard', k.OPEN_AFS)
    const { farmer, files } = store
    const allFiles = files.published.concat(files.purchased)
    const file = allFiles.find(file => file.did === load.did)
    const updateAvailable = file.status === k.UPDATE_AVAILABLE ? true : false
    await farmerManager.unjoinBroadcast({ farmer: farmer.farm, did: load.did })
    dispatch({ type: k.FEED_CONTENT_VIEWER, load: { ...load, fileList: [] } })
    windowManager.openWindow('afsExplorerView')
    const fileList = await afsManager.getFileList(load.did)
    dispatch({ type: k.FEED_CONTENT_VIEWER, load: { ...load, fileList, updateAvailable } })
    windowManager.pingView({ view: 'afsExplorerView', event: k.REFRESH })
  } catch (err) {
    debug("Error: %o", err)
  }
})

ipcMain.on(k.CLOSE_AFS_EXPLORER, async (event, load) => {
  try {
    const { farmer, files } = store
    const fileList = files.published.concat(files.purchased)
    const file = fileList.find(file => file.did === load.did)
    if (file.shouldBroadcast) {
      internalEmitter.emit(k.START_SEEDING, load )
    }
  } catch (err) {
    debug("Error: %o", err)
  }
})

internalEmitter.on(k.CONFIRM_QUIT, async () => {
  dispatch({ type: k.FEED_MODAL, load: { modalName: 'quitConfirm', callback: () => app.quit() } })
  windowManager.openModal('generalActionModal')
})

ipcMain.on(k.TOGGLE_ANALYTICS_PERMISSION, () => {
  const analyticsPermission = afmManager.toggleAnalyticsPermission(store.account.userAid)
  dispatch({ type: k.TOGGLE_ANALYTICS_PERMISSION, load: { analyticsPermission }})
})