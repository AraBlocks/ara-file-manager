const debug = require('debug')('acm:kernel:lib:actionCreators:purchase')
const dispatch = require('../reducers/dispatch')
const { ipcMain } = require('electron')
const {
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
	try {
		await araContractsManager.purchaseItem(load.aid)
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
			status: PURCHASE,
			path: makeAfsPath(load.aid)
		}
		dispatch({ type: PURCHASE, load: dispatchLoad })
	} catch(e) {
		debug(e)
	}
})
