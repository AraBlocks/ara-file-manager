'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:download')
const dispatch = require('../reducers/dispatch')
const { afsManager } = require('../actions')
const {
	DOWNLOAD,
	DOWNLOADED,
	DOWNLOADING,
	DOWNLOAD_FAILED,
	REFRESH
} = require('../../../lib/constants/stateManagement')
const { ipcMain } = require('electron')
const windowManager = require('electron-window-manager')
const store = windowManager.sharedData.fetch('store')

ipcMain.on(DOWNLOAD, async (event, load) => {
	debug('%s heard. Load: %O', DOWNLOAD, load)
	try {
		debug('Dispatching %s', DOWNLOADING)
		dispatch({ type: DOWNLOADING, load })
		windowManager.pingView({ view: 'filemanager', event: REFRESH })
		afsManager.download({
			farmer: store.farmer.farm,
			did: load.did,
			handler: (load) => {
				dispatch({ type: 'SET_SIZE', load: load.size })
				windowManager.pingView({ view: 'filemanager', event: REFRESH })
				if (load.downloadPercent !== 1) {
					debug('Dispatching %s', DOWNLOADING)
					// dispatch({ type: DOWNLOADING, load })
					// windowManager.pingView({ view: 'filemanager', event: REFRESH })
				} else {
					debug('Dispatching %s', DOWNLOADED)
					dispatch({ type: DOWNLOADED, load: load.did })
					windowManager.pingView({ view: 'filemanager', event: REFRESH })
				}
			}, errorHandler: () => {
				debug('Download failed')
				debug('Dispatching %s . Load: %s', DOWNLOAD_FAILED, load.did)
				dispatch({ type: DOWNLOAD_FAILED, load: load.did })
				windowManager.pingView({ view: 'filemanager', event: REFRESH })
			}
		})
	} catch (err) {
		debug('Error: %O', err)
	}
})