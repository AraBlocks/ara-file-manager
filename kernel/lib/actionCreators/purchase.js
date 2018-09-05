const debug = require('debug')('acm:kernel:lib:actionCreators:purchase')
const dispatch = require('../reducers/dispatch')
const { ipcMain } = require('electron')
const {
	afsManager: { makeAfsPath },
  araContractsManager,
} = require('../actions')
const {
	PURCHASE,
	PURCHASED,
	PURCHASING
} = require('../../../lib/constants/stateManagement')
const windowManager = require('electron-window-manager')

ipcMain.on(PURCHASE, async (event, load) => {
	debug('%s heard. Load: %O', PURCHASE, load)
	const dispatchLoad = {
		downloadPercent: 0,
		meta: {
			aid: load.aid,
			datePublished: '11/20/1989',
			earnings: 2134.33,
			peers: 353,
			price: load.price,
		},
		name: load.fileName,
		size: 0,
		status: PURCHASING,
		path: makeAfsPath(load.aid)
	}
	araContractsManager.purchaseItem(load.aid)
		.then(async () => {
			debug('purchased')
			dispatchLoad.status = PURCHASED
			dispatch({ type: PURCHASED, load: dispatchLoad })
			windowManager.pingView({ view: 'filemanager', event: PURCHASED })
		}).catch(debug)
	debug('hi')
	dispatch({ type: PURCHASING, load: dispatchLoad })
	windowManager.pingView({ view: 'filemanager', event: PURCHASING })
})
