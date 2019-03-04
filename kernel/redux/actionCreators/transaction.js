const debug = require('debug')('afm:kernel:lib:actionCreators:transaction')

const { events } = require('k')
const { ipcMain } = require('electron')
const { internalEmitter } = require('electron-window-manager')
const windowManager = require('electron-window-manager')

const dispatch = require('../reducers/dispatch')
const menuHelper = require('../../../boot/menuHelper')

internalEmitter.on(events.CHANGE_PENDING_PUBLISH_STATE, load => changePendingTXState(null, load))
ipcMain.on(events.CHANGE_PENDING_PUBLISH_STATE, changePendingTXState)

ipcMain.on(events.CANCEL_TRANSACTION, () => {
  debug('%s heard', events.CANCEL_TRANSACTION)
	internalEmitter.emit(events.CHANGE_PENDING_PUBLISH_STATE, false)
})

function changePendingTXState(_, load) {
  debug('%s heard', events.CHANGE_PENDING_PUBLISH_STATE)
  dispatch({ type: events.CHANGE_PENDING_PUBLISH_STATE, load: { pendingPublish: load } })
  windowManager.pingAll({ event: events.REFRESH })
  menuHelper.switchPublishState(load)
}
