'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:purchase')
const dispatch = require('../reducers/dispatch')
const {
	afsManager: { makeAfsPath },
	araContractsManager,
} = require('../actions')
const k = require('../../../lib/constants/stateManagement')
const { ipcMain } = require('electron')
const windowManager = require('electron-window-manager')
const { internalEmitter } = require('electron-window-manager')
const { account } = windowManager.sharedData.fetch('store')

ipcMain.on(k.PURCHASE, async (event, load) => {
	debug('%s heard. Load: %O', k.PURCHASE, load)
	const dispatchLoad = {
		downloadPercent: 0,
		did: load.aid,
		datePublished: '11/20/1989',
		earnings: 0,
		peers: 1,
		price: load.price,
		name: load.fileName,
		size: 0,
		status: k.PURCHASING,
		path: makeAfsPath(load.aid)
	}
	araContractsManager.purchaseItem(load.aid)
		.then(async () => {
			const araBalance = await araContractsManager.getAraBalance(account.userAid)
			dispatch({ type: k.PURCHASED, load: araBalance })
			windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
		})
		.catch((error) => {
			debug(error)
			dispatch({ type: k.FEED_MODAL, load:  { modalName: 'failureModal2' } })
      internalEmitter.emit(k.OPEN_MODAL, 'generalMessageModal')
		})

	dispatch({ type: k.PURCHASING, load: dispatchLoad })
	windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
})

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
		if (library.includes( '0x' + load.aid.slice(-64))) {
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
		dispatch({ type: k.FEED_MODAL, load:  { modalName: 'failureModal2' } })
		internalEmitter.emit(k.OPEN_MODAL, 'generalMessageModal')
	}
})
