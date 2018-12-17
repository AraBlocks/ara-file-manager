'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:download')
const { araContractsManager, identityManager } = require('../actions')
const araUtil = require('ara-util')
const dispatch = require('../reducers/dispatch')
const k = require('../../../lib/constants/stateManagement')
const { ipcMain } = require('electron')
const windowManager = require('electron-window-manager')
const { web3 } = require('ara-util')
const store = windowManager.sharedData.fetch('store')

ipcMain.on(k.SEND_ARA, (event, load) => {
	let modalName = 'generalFailure'
	try {
		debug('%s heard', k.SEND_ARA)
		const isValidEthAddress = web3.isAddress(load.receiver)
		const isValidDid = identityManager.isValidDid(load.receiver)
		if (!isValidDid && !isValidEthAddress) {
			load.receiver.length >= 64
				? modalName = 'invalidDid'
				: modalName = 'invalidAddress'
			throw new Error('invalid receiver or amount')
		} else if (Number(load.amount) <= 0) {
			modalName = 'invalidAmount'
			throw new Error('invalid receiver or amount')
		} else if (Number(load.amount) > store.account.araBalance) {
			modalName = 'notEnoughAra'
			throw new Error('invalid receiver or amount')
		} else {
			debug('Dispatching %s', k.FEED_MODAL)
			dispatch({ type: k.FEED_MODAL, load })
			windowManager.openModal('confirmSendModal')
		}
	} catch (err) {
		debug('Error: %o', err)
		dispatch({ type: k.FEED_MODAL, load: { modalName, callback: () => windowManager.openWindow('sendAra') } })
		windowManager.openModal('generalMessageModal')
	}
})

ipcMain.on(k.CONFIRM_SEND_ARA, async (event, load) => {
	const { account } = store
	try {
		debug('%s heard', k.CONFIRM_SEND_ARA)
		let dispatchLoad = { modalName: 'sendingAra', load }
		dispatch({ type: k.FEED_MODAL, load: dispatchLoad })
		windowManager.openModal('generalPleaseWaitModal')
		windowManager.internalEmitter.emit(k.CHANGE_PENDING_TRANSACTION_STATE, true)
		let walletAddress = load.receiver
		if (!web3.isAddress(load.receiver)) {
			walletAddress = await araUtil.getAddressFromDID(load.receiver)
		}
		await araContractsManager.sendAra({
			amount: load.amount,
			completeHandler: araSent,
			errorHandler: failedToSend,
			password: account.password,
			userDID: account.userAid,
			walletAddress,
		})
	} catch (err) {
		debug('Error sending ara: %o', err)
		windowManager.internalEmitter.emit(k.CHANGE_PENDING_TRANSACTION_STATE, false)
	}
})

async function araSent(amount) {
	windowManager.closeModal('generalPleaseWaitModal')
	windowManager.internalEmitter.emit(k.CHANGE_PENDING_TRANSACTION_STATE, false)
	dispatch({
		type: k.FEED_MODAL, load: {
			modalName: 'araSent',
			load: { amount }
		}
	})
	windowManager.openModal('generalMessageModal')
	const newBalance = await araContractsManager.getAraBalance(store.account.userAid)
	windowManager.internalEmitter.emit(k.UPDATE_ARA_BALANCE, { araBalance: newBalance })
}

function failedToSend() {
	windowManager.closeModal('generalPleaseWaitModal')
	dispatch({
		type: k.FEED_MODAL, load: {
			modalName: 'generalFailure',
			callback: () => windowManager.openWindow('sendAra')
		}
	})
	windowManager.openModal('generalMessageModal')
}