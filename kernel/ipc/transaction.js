const debug = require('debug')('afm:kernel:lib:actionCreators:transaction')
const dispatch = require('../state/dispatch')
const { events: k } = require('k')
const windowManager = require('electron-window-manager')
const { ipcMain } = require('electron')
const { internalEmitter } = require('electron-window-manager')
const menuHelper = require('../../boot/menuHelper')

internalEmitter.on(k.CHANGE_PENDING_PUBLISH_STATE, load => changePendingTXState(null, load))
ipcMain.on(k.CHANGE_PENDING_PUBLISH_STATE, changePendingTXState)

ipcMain.on(k.CANCEL_TRANSACTION, () => {
  debug('%s heard', k.CANCEL_TRANSACTION)
	internalEmitter.emit(k.CHANGE_PENDING_PUBLISH_STATE, false)
})

function changePendingTXState(_, load) {
  debug('%s heard', k.CHANGE_PENDING_PUBLISH_STATE)
  dispatch({ type: k.CHANGE_PENDING_PUBLISH_STATE, load: { pendingPublish: load } })
  windowManager.pingAll({ event: k.REFRESH })
  menuHelper.switchPublishState(load)
}
