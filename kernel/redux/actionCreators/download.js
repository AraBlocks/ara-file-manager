'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:download')
const dispatch = require('../reducers/dispatch')
const { farmerManager } = require('../actions')
const k = require('../../../lib/constants/stateManagement')
const { ipcMain } = require('electron')
const windowManager = require('electron-window-manager')
const store = windowManager.sharedData.fetch('store')

ipcMain.on(k.DOWNLOAD, async (event, load) => {
	debug('%s heard', k.DOWNLOAD)
	try {
		const { jobId } = store.files.purchased.find(({ did }) => did === load.did)

		dispatch({ type: k.CONNECTING, load })
		windowManager.pingView({ view: 'filemanager', event: k.REFRESH })

		farmerManager.download({
			did: load.did,
			jobId,
			farmer: store.farmer.farm,
			progressHandler,
			completeHandler,
			errorHandler
		})
	} catch (err) {
		debug('Error: %O', err)
	}
})

ipcMain.on(k.PAUSE_DOWNLOAD, async (event, load) => {
	debug('%s heard', k.PAUSE_DOWNLOAD)
	try {
		debug('Dispatching %s', k.PAUSED)
		dispatch({ type: k.PAUSED, load })
		windowManager.pingView({ view: 'filemanager', event: k.REFRESH })

		farmerManager.unjoinBroadcast({
			did: load.did,
			farmer: store.farmer.farm,
		})
	} catch (err) {
		debug('Error: %O', err)
	}
})

function progressHandler(load) {
	debug('Dispatching %s', k.DOWNLOADING)
	dispatch({ type: k.DOWNLOADING, load })
	windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
}

function completeHandler(did) {
	debug('Dispatching %s', k.DOWNLOADED)
	dispatch({ type: k.DOWNLOADED, load: { did } })
	windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
}

function errorHandler(did) {
	debug('Download failed')
	debug('Dispatching %s', did)
	dispatch({ type: k.DOWNLOAD_FAILED, load: { did } })
	windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
}