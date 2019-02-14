const debug = require('debug')('ara:fm:kernel:ipc:utils')
const { events: k } = require('k')
const dispatch = require('../state/dispatch')
const {
  afsManager,
  afmManager,
  farmerManager
} = require('../daemons')
const { ipcMain, app } = require('electron')
const windowManager = require('electron-window-manager')
const { internalEmitter } = require('electron-window-manager')
const store = windowManager.sharedData.fetch('store')

internalEmitter.on(k.CLEAN_UI, () => {
  debug('%s heard', k.CLEAN_UI)
  dispatch({ type: k.CLEAN_UI })
  windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
})

ipcMain.on(k.OPEN_AFS, async (_, load) => {
  debug('%s heard', k.OPEN_AFS)
  const { farmer, files, application } = store
  if (application.exportWindowOpen) { return }
  try {
    const allFiles = files.published.concat(files.purchased)
    const file = allFiles.find(file => file.did === load.did)

    const updateAvailable = file.status === k.UPDATE_AVAILABLE
    dispatch({ type: k.FEED_CONTENT_VIEWER, load: { ...load, fileList: [] } })

    windowManager.openWindow('afsExplorerView')
    windowManager.pingView({ view: 'filemanager', event: k.REFRESH })

    await farmerManager.unjoinBroadcast({ farmer: farmer.farm, did: load.did })
    const fileList = await afsManager.getFileList(load.did)
    dispatch({ type: k.FEED_CONTENT_VIEWER, load: { ...load, fileList, updateAvailable } })

    windowManager.pingView({ view: 'afsExplorerView', event: k.REFRESH })
  } catch (err) {
    debug("Error: %o", err)
  }
})

ipcMain.on(k.CLOSE_AFS_EXPLORER, async (event, load) => {
  try {
    const { files } = store
    const fileList = files.published.concat(files.purchased)
    const file = fileList.find(file => file.did === load.did)
    dispatch({ type: k.CLOSE_AFS_EXPLORER, load })
    windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
    if (file.shouldBroadcast) {
      internalEmitter.emit(k.START_SEEDING, load)
    }
  } catch (err) {
    debug("Error: %o", err)
  }
})

internalEmitter.on(k.CONFIRM_QUIT, () => {
  dispatch({ type: k.FEED_MODAL, load: { modalName: 'quitConfirm', callback: () => app.quit() } })
  windowManager.openModal('generalActionModal')
})

ipcMain.on(k.TOGGLE_ANALYTICS_PERMISSION, () => {
  const analyticsPermission = afmManager.toggleAnalyticsPermission(store.account.userDID)
  dispatch({ type: k.TOGGLE_ANALYTICS_PERMISSION, load: { analyticsPermission } })
  windowManager.pingView({ view: 'accountInfo', event: k.REFRESH })
})

internalEmitter.on(k.UPDATE_AVAILABLE, (load) => {
  debug('%s HEARD', k.UPDATE_AVAILABLE)
  dispatch({ type: k.UPDATE_AVAILABLE, load: { did: load.did } })
  windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
})
