const debug = require('debug')('ara:fm:kernel:ipc:utils')

const { events } = require('k')
const { ipcMain, app } = require('electron')
const windowManager = require('electron-window-manager')
const { internalEmitter } = require('electron-window-manager')

const {
  afs,
  afm,
  rewardsDCDN
} = require('../daemons')
const dispatch = require('../redux/reducers/dispatch')

const store = windowManager.sharedData.fetch('store')

internalEmitter.on(events.CLEAN_UI, () => {
  debug('%s heard', events.CLEAN_UI)
  dispatch({ type: events.CLEAN_UI })
  windowManager.pingView({ view: 'filemanager', event: events.REFRESH })
})

ipcMain.on(events.OPEN_AFS, async (_, load) => {
  debug('%s heard', events.OPEN_AFS)
  const { farmer, files, application } = store
  if (application.exportWindowOpen) { return }
  try {
    const allFiles = files.published.concat(files.purchased)
    const file = allFiles.find(file => file.did === load.did)

    const updateAvailable = file.status === events.UPDATE_AVAILABLE
    dispatch({ type: events.FEED_CONTENT_VIEWER, load: { ...load, fileList: [] } })

    windowManager.openWindow('afsExplorerView')
    windowManager.pingView({ view: 'filemanager', event: events.REFRESH })

    await rewardsDCDN.unjoinBroadcast({ farmer: farmer.farm, did: load.did })
    const fileList = await afs.getFileList(load.did)
    dispatch({ type: events.FEED_CONTENT_VIEWER, load: { ...load, fileList, updateAvailable } })

    windowManager.pingView({ view: 'afsExplorerView', event: events.REFRESH })
  } catch (err) {
    debug("Error: %o", err)
  }
})

ipcMain.on(events.CLOSE_AFS_EXPLORER, async (event, load) => {
  try {
    const { files } = store
    const fileList = files.published.concat(files.purchased)
    const file = fileList.find(file => file.did === load.did)
    dispatch({ type: events.CLOSE_AFS_EXPLORER, load })
    windowManager.pingView({ view: 'filemanager', event: events.REFRESH })
    if (file.shouldBroadcast) {
      internalEmitter.emit(events.START_SEEDING, load)
    }
  } catch (err) {
    debug("Error: %o", err)
  }
})

internalEmitter.on(events.CONFIRM_QUIT, () => {
  dispatch({ type: events.FEED_MODAL, load: { modalName: 'quitConfirm', callback: () => app.quit() } })
  windowManager.openModal('generalActionModal')
})

ipcMain.on(events.TOGGLE_ANALYTICS_PERMISSION, () => {
  const analyticsPermission = afm.toggleAnalyticsPermission(store.account.userDID)
  dispatch({ type: events.TOGGLE_ANALYTICS_PERMISSION, load: { analyticsPermission } })
  windowManager.pingView({ view: 'accountInfo', event: events.REFRESH })
})

internalEmitter.on(events.UPDATE_AVAILABLE, (load) => {
  debug('%s HEARD', events.UPDATE_AVAILABLE)
  dispatch({ type: events.UPDATE_AVAILABLE, load: { did: load.did } })
  windowManager.pingView({ view: 'filemanager', event: events.REFRESH })
})