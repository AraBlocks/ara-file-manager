'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:purchase')
const dispatch = require('../reducers/dispatch')
const {
	afsManager: { getAFSPrice, makeAfsPath },
	araContractsManager,
} = require('../actions')
const {
	FEED_MODAL,
	OPEN_MODAL,
	PROMPT_PURCHASE,
	PURCHASE,
	PURCHASED,
	PURCHASING
} = require('../../../lib/constants/stateManagement')
const { ipcMain } = require('electron')
const windowManager = require('electron-window-manager')
const { internalEmitter } = require('electron-window-manager')

ipcMain.on(PURCHASE, async (event, load) => {
	debug('%s heard. Load: %O', PURCHASE, load)
	const dispatchLoad = {
		downloadPercent: 0,
		did: load.aid,
		datePublished: '11/20/1989',
		earnings: 0,
		peers: 1,
		price: load.price,
		name: load.fileName,
		size: 0,
		status: PURCHASING,
		path: makeAfsPath(load.aid)
	}
	araContractsManager.purchaseItem(load.aid)
		.then(async () => {
			dispatch({ type: PURCHASED })
			windowManager.pingView({ view: 'filemanager', event: REFRESH })
		}).catch(debug)

	dispatch({ type: PURCHASING, load: dispatchLoad })
	windowManager.pingView({ view: 'filemanager', event: REFRESH })
})

internalEmitter.once(PROMPT_PURCHASE, async (load) => {
	try {
		debug('%s heard. Load: %o', PROMPT_PURCHASE, load)
		const price = await getAFSPrice({ did: load.aid })
		dispatch({ type: FEED_MODAL, load: { price, ...load } })
		internalEmitter.emit(OPEN_MODAL, 'checkoutModal1')
	} catch (err) {
		debug('Error: %O', err)
	}
})
