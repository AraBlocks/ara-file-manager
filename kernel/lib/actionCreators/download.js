'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:download')
const dispatch = require('../reducers/dispatch')
const { afsManager } = require('../actions')
const k = require('../../../lib/constants/stateManagement')
const { ipcMain } = require('electron')
const windowManager = require('electron-window-manager')
const store = windowManager.sharedData.fetch('store')

ipcMain.on(k.DOWNLOAD, async (event, load) => {
	debug('%s heard. Load: %O', k.DOWNLOAD, load)
	try {
		debug('Dispatching %s', k.DOWNLOADING)
		dispatch({ type: k.DOWNLOADING, load })
		windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
		afsManager.download({
			farmer: store.farmer.farm,
			did: load.did,
			handler: (load) => {
				dispatch({ type: 'SET_SIZE', load: load.size })
				windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
				if (load.downloadPercent !== 1) {
					debug('Dispatching %s', k.DOWNLOADING)
					// dispatch({ type: DOWNLOADING, load })
					// windowManager.pingView({ view: 'filemanager', event: REFRESH })
				} else {
					debug('Dispatching %s', k.DOWNLOADED)
					dispatch({ type: k.DOWNLOADED, load: load.did })
					windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
				}
			}, errorHandler: () => {
				debug('Download failed')
				debug('Dispatching %s . Load: %s', k.DOWNLOAD_FAILED, load.did)
				dispatch({ type: k.DOWNLOAD_FAILED, load: load.did })
				windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
			}
		})
	} catch (err) {
		debug('Error: %O', err)
	}
})