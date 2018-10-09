'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:purchase')
const dispatch = require('../reducers/dispatch')
const {
	utils: actionsUtil,
	araContractsManager,
} = require('../actions')
const k = require('../../../lib/constants/stateManagement')
const { ipcMain } = require('electron')
const windowManager = require('electron-window-manager')
const { internalEmitter } = require('electron-window-manager')
const { account } = windowManager.sharedData.fetch('store')

internalEmitter.on(k.PROMPT_PURCHASE, async (load) => {
	try {
		debug('%s heard. Load: %o', k.PROMPT_PURCHASE, load)
		if (account.userAid == null) {
			debug('not logged in')
			dispatch({ type: k.FEED_MODAL, load: { modalName: 'notLoggedIn' } })
			internalEmitter.emit(k.OPEN_MODAL, 'generalMessageModal')
			return
		}
		const library = await araContractsManager.getLibraryItems(account.userAid)
		if (library.includes('0x' + load.aid.slice(-64))) {
			debug('already own item')
			dispatch({ type: k.FEED_MODAL, load: { modalName: 'alreadyOwn' } })
			internalEmitter.emit(k.OPEN_MODAL, 'generalMessageModal')
			return
		}

		const price = await araContractsManager.getAFSPrice({ did: load.aid })
		dispatch({ type: k.FEED_MODAL, load: { price, ...load } })
		internalEmitter.emit(k.OPEN_MODAL, 'checkoutModal1')
	} catch (err) {
		debug('Error: %O', err)
		dispatch({ type: k.FEED_MODAL, load: { modalName: 'failureModal2' } })
		internalEmitter.emit(k.OPEN_MODAL, 'generalMessageModal')
	}
})

ipcMain.on(k.PURCHASE, async (event, load) => {
	debug('%s heard: %s', k.PURCHASE, load.aid)
	try {
		const descriptorOpts = {
			peers: 1,
			name: load.fileName,
			status: k.PURCHASING,
		}
		const descriptor = await actionsUtil.descriptorGenerator(load.aid, descriptorOpts)
		dispatch({ type: k.PURCHASING, load: descriptor })
		windowManager.pingView({ view: 'filemanager', event: k.REFRESH })

		await araContractsManager.purchaseItem(load.aid)
		const araBalance = await araContractsManager.getAraBalance(account.userAid)

		dispatch({ type: k.PURCHASED, load: araBalance })
		windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
	} catch (err) {
		debug(err)
		dispatch({ type: k.FEED_MODAL, load: { modalName: 'failureModal2' } })
		internalEmitter.emit(k.OPEN_MODAL, 'generalMessageModal')
	}
})
