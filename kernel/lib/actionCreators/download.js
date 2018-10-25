'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:download')
const dispatch = require('../reducers/dispatch')
const { farmerManager } = require('../actions')
const k = require('../../../lib/constants/stateManagement')
const { ipcMain } = require('electron')
const windowManager = require('electron-window-manager')
const store = windowManager.sharedData.fetch('store')

ipcMain.on(k.DOWNLOAD, async (event, load) => {
	debug('%s heard. Load: %O', k.DOWNLOAD, load)
	try {
		debug('Dispatching %s', k.DOWNLOADING)

		const { jobId } = store.files.purchased.find(({ did }) => did === load)
		debug({jobId})
		dispatch({ type: k.DOWNLOADING, load })
		windowManager.pingView({ view: 'filemanager', event: k.REFRESH })

		farmerManager.download({
			did: load,
			jobId,
			farmer: store.farmer.farm,
			startHandler,
			progressHandler,
			completeHandler,
			errorHandler
		})
	} catch (err) {
		debug('Error: %O', err)
	}
})

function startHandler(size) {
	console.log({ size })
	dispatch({ type: k.SET_SIZE, load: size })
	windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
}

function progressHandler(load) {
	debug('Dispatching %s', k.DOWNLOADING)
	dispatch({ type: k.DOWNLOADING, load })
	windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
}

function completeHandler(did) {
	debug('Dispatching %s', k.DOWNLOADED)
	dispatch({ type: k.DOWNLOADED, load: did })
	windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
}

function errorHandler(did) {
	debug('Download failed')
	debug('Dispatching %s . Load: %s', k.DOWNLOAD_FAILED, did)
	dispatch({ type: k.DOWNLOAD_FAILED, load: did })
	windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
}