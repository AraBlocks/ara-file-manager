const debug = require('debug')('afm:kernel:lib:actionCreators:download')

const araUtil = require('ara-util')
const { events } = require('k')
const { ipcMain } = require('electron')
const { web3 } = require('ara-util')
const windowManager = require('electron-window-manager')

const dispatch = require('../reducers/dispatch')
const { act, aid } = require('../../daemons')

const store = windowManager.sharedData.fetch('store')

ipcMain.on(events.SEND_ARA, (_, load) => {
	let modalName = 'generalFailure'
	try {
		debug('%s heard', events.SEND_ARA)
		const isValidEthAddress = web3.isAddress(load.receiver)
		const isValidDid = aid.isValidDid(load.receiver)
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
			debug('Dispatching %s', events.FEED_MODAL)
			dispatch({ type: events.FEED_MODAL, load })
			windowManager.openModal('confirmSendModal')
		}
	} catch (err) {
		debug('Error: %o', err)
		dispatch({ type: events.FEED_MODAL, load: { modalName, callback: () => windowManager.openWindow('sendAra') } })
		windowManager.openModal('generalMessageModal')
	}
})

ipcMain.on(events.CONFIRM_SEND_ARA, async (event, load) => {
	const { account, account: { autoQueue } } = store
	try {
		debug('%s heard', events.CONFIRM_SEND_ARA)

		let walletAddress = load.receiver
		if (!web3.isAddress(load.receiver)) {
			walletAddress = await araUtil.getAddressFromDID(load.receiver)
		}

		const sendAraLoad = {
			val: load.amount,
			password: account.password,
			did: account.userDID,
			to: walletAddress,
		}
		await autoQueue.push(() => act.sendAra(sendAraLoad))

		dispatch({
			type: events.FEED_MODAL, load: {
				modalName: 'araSent', load: {
					amount: load.amount,
					did: load.receiver
				}
			}
		})
		windowManager.openModal('generalMessageModal')
	} catch (err) {
		debug('Error sending ara: %o', err)

		dispatch({
			type: events.FEED_MODAL, load: {
				modalName: 'generalFailure',
				callback: () => windowManager.openWindow('sendAra')
			}
		})
		windowManager.openModal('generalMessageModal')
	}
})