'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:download')
const { araContractsManager } = require('../actions')
const dispatch = require('../reducers/dispatch')
const k = require('../../../lib/constants/stateManagement')
const { ipcMain } = require('electron')
const windowManager = require('electron-window-manager')
const { web3 } = require('ara-util')
const store = windowManager.sharedData.fetch('store')

ipcMain.on(k.SEND_ARA, (event, load) => {
	try {
		debug('%s heard', k.SEND_ARA)
		if (!web3.isAddress(load.walletAddress)) {
			dispatch({ type: k.FEED_MODAL, load: { modalName: 'invalidAddress' } })
			windowManager.openModal('generalMessageModal')
		} else if (load.amount <= 0) {
			dispatch({ type: k.FEED_MODAL, load: { modalName: 'invalidAmount' } })
			windowManager.openModal('generalMessageModal')
		} else if (load.amount > store.account.araBalance) {
			dispatch({ type: k.FEED_MODAL, load: { modalName: 'notEnoughAra' } })
			windowManager.openModal('generalMessageModal')
		} else {
			debug('Dispatching %s', k.FEED_MODAL)
			dispatch({ type: k.FEED_MODAL, load })
			windowManager.openModal('confirmSendModal')
		}
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
		araContractsManager.sendAra({
			...load,
			completeHandler: araSent,
			errorHandler: failedToSend
		})
	} catch(err) {
		debug('Error sending ara: %o', err)
		windowManager.internalEmitter.emit(k.CHANGE_PENDING_TRANSACTION_STATE, false)
	}
})

async function araSent(amount) {
	windowManager.closeModal('generalPleaseWaitModal')
	windowManager.internalEmitter.emit(k.CHANGE_PENDING_TRANSACTION_STATE, false)
	dispatch({ type: k.FEED_MODAL, load: {
			modalName: 'araSent',
			amount
		}
	})
	windowManager.openModal('generalMessageModal')
	const newBalance = await araContractsManager.getAraBalance(store.account.userAid)
	windowManager.internalEmitter.emit(k.UPDATE_BALANCE, { araBalance: newBalance })
}

function failedToSend() {
	windowManager.closeModal('generalPleaseWaitModal')
	dispatch({ type: k.FEED_MODAL, load: { modalName: 'generalFailure' }})
	windowManager.openModal('generalMessageModal')
}