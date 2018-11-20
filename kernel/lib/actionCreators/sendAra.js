'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:download')
const { araContractsManager } = require('../actions')
const dispatch = require('../reducers/dispatch')
const k = require('../../../lib/constants/stateManagement')
const { ipcMain } = require('electron')
const windowManager = require('electron-window-manager')

ipcMain.on(k.SEND_ARA, (event, load) => {
	try {
		debug('%s heard', k.SEND_ARA)
		debug('Dispatching %s', k.FEED_MODAL)
		dispatch({ type: k.FEED_MODAL, load })
		windowManager.openModal('confirmSendModal')
	} catch(err) {
		debug('Error: %o', err)
	}
})

ipcMain.on(k.CONFIRM_SEND_ARA, async (event, load) => {
	try {
		debug('%s heard', k.CONFIRM_SEND_ARA)
		let dispatchLoad = { modalName: 'sendingAra', amount: load.amount }
		dispatch({ type: k.FEED_MODAL, load: dispatchLoad })
		windowManager.openModal('generalPleaseWaitModal')
		windowManager.internalEmitter.emit(k.CHANGE_PENDING_TRANSACTION_STATE, true)
		araContractsManager.sendAra({ ...load, completeHandler: araSent })
	} catch(err) {
		debug('Error sending ara: %o', err)
		windowManager.internalEmitter.emit(k.CHANGE_PENDING_TRANSACTION_STATE, false)
	}
})

function araSent(amount) {
	windowManager.closeModal('generalPleaseWaitModal')
	windowManager.internalEmitter.emit(k.CHANGE_PENDING_TRANSACTION_STATE, false)
	dispatch({ type: k.FEED_MODAL, load: {
			modalName: 'araSent',
			amount
		}
	})
	windowManager.openModal('generalMessageModal')
}