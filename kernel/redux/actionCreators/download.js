'use strict'

const debug = require('debug')('afm:kernel:lib:actionCreators:download')
const dispatch = require('../reducers/dispatch')
const { farmerManager } = require('../actions')
const k = require('../../../lib/constants/stateManagement')
const { ipcMain } = require('electron')
const { internalEmitter } = require('electron-window-manager')
const windowManager = require('electron-window-manager')
const store = windowManager.sharedData.fetch('store')

ipcMain.on(k.DOWNLOAD, download)
internalEmitter.on(k.DOWNLOAD, (load) => download(null, load))

async function download(event, load) {
	debug('%s heard', k.DOWNLOAD)
	try {
		const { jobId } = store.files.purchased.find(({ did }) => did === load.did)

		dispatch({ type: k.CONNECTING, load })
		windowManager.pingView({ view: 'filemanager', event: k.REFRESH })

		farmerManager.download({
			did: load.did,
			jobId,
			farmer: store.farmer.farm,
			errorHandler
		})
	} catch (err) {
		debug('Error: %O', err)
	}
}

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

internalEmitter.on(k.DOWNLOADING, (load) => {
	const files = store.files.published.concat(store.files.purchased)
	const file = files.find(file => file.did === load.did)
	let prevPercent = file.downloadPercent
	const perc = load.currentBlock / load.totalBlocks
	const size = load.totalBlocks * 6111 * 10
	if (perc >= prevPercent + 0.1) {
		prevPercent = perc
		if (perc != 1) {
			debug('Dispatching %s', k.DOWNLOADING)
			dispatch({
				type: k.DOWNLOADING,
				load: {
					downloadPercent: perc,
					did: load.did,
					size
				}
			})
			windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
		}
	}
})

internalEmitter.on(k.DOWNLOADED, (load) => {
	debug('Dispatching %s', k.DOWNLOADED)
	dispatch({ type: k.DOWNLOADED, load })
	windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
})

internalEmitter.on(k.UPDATE_PEER_COUNT, (load) => {
	dispatch({ type: k.UPDATE_PEER_COUNT, load })
	windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
})

function errorHandler(did) {
	debug('Download failed')
	debug('Dispatching %s', did)
	dispatch({ type: k.DOWNLOAD_FAILED, load: { did } })
	windowManager.pingView({ view: 'filemanager', event: k.REFRESH })
}