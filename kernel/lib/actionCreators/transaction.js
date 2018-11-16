const debug = require('debug')('acm:kernel:lib:actionCreators:transaction')
const dispatch = require('../reducers/dispatch')
const k = require('../../../lib/constants/stateManagement')
const windowManager = require('electron-window-manager')
const { ipcMain } = require('electron')
const { internalEmitter } = require('electron-window-manager')
const { switchPendingTransactionState } = require('../../../boot/tray')

internalEmitter.on(k.CHANGE_PENDING_TRANSACTION_STATE, (load) => {
	debug('%s heard', k.CHANGE_PENDING_TRANSACTION_STATE)
  dispatch({ type: k.CHANGE_PENDING_TRANSACTION_STATE, load })
  windowManager.pingAll({ event: k.REFRESH })
  switchPendingTransactionState(load.pendingTransaction)
})

ipcMain.on(k.CANCEL_TRANSACTION, () => {
  debug('%s heard', k.CANCEL_TRANSACTION)
	internalEmitter.emit(k.CHANGE_PENDING_TRANSACTION_STATE, { pendingTransaction: false })
})
