const debug = require('debug')('ara:fm:kernel:ipc:download')

const { events } = require('k')
const { internalEmitter } = require('electron-window-manager')
const { ipcMain } = require('electron')
const windowManager = require('electron-window-manager')

const dispatch = require('../redux/reducers/dispatch')
const { rewardsDCDN, utils } = require('../daemons')

const store = windowManager.sharedData.fetch('store')

ipcMain.on(events.DOWNLOAD, download)
internalEmitter.on(events.DOWNLOAD, (load) => download(null, load))

async function download(_, load) {
	debug('%s heard', events.DOWNLOAD)
	try {
		const { jobId } = store.files.purchased.concat(store.files.published)
			.find(({ did }) => did === load.did)

		dispatch({ type: events.CONNECTING, load })
		windowManager.pingView({ view: 'filemanager', event: events.REFRESH })

		rewardsDCDN.download({
			did: load.did,
			jobId,
			farmer: store.farmer.farm,
			errorHandler
		})
	} catch (err) {
		debug('Error: %O', err)
	}
}

ipcMain.on(events.PAUSE_DOWNLOAD, async (event, load) => {
	debug('%s heard', events.PAUSE_DOWNLOAD)
	try {
		debug('Dispatching %s', events.PAUSED)
		dispatch({ type: events.PAUSED, load })
		windowManager.pingView({ view: 'filemanager', event: events.REFRESH })

		rewardsDCDN.unjoinBroadcast({
			did: load.did,
			farmer: store.farmer.farm,
		})
	} catch (err) {
		debug('Error: %O', err)
	}
})

internalEmitter.on(events.DOWNLOADING, (load) => {
	const files = store.files.published.concat(store.files.purchased)
	const file = files.find(file => file.did === load.did)
	let prevPercent = file.downloadPercent
	const perc = load.currentBlock / load.totalBlocks
	const size = load.totalBlocks * 6111 * 10
	if (perc >= prevPercent + 0.1) {
		prevPercent = perc
		if (perc != 1) {
			debug('Dispatching %s', events.DOWNLOADING)
			dispatch({
				type: events.DOWNLOADING,
				load: {
					downloadPercent: perc,
					did: load.did,
					size
				}
			})
			windowManager.pingView({ view: 'filemanager', event: events.REFRESH })
		}
	}
})

internalEmitter.on(events.DOWNLOADED, async (load) => {
	debug('Dispatching %s', events.DOWNLOADED)
	const fileInfo = await utils.readFileMetadata(load.did)
	dispatch({ type: events.DOWNLOADED, load: { did: load.did, name: fileInfo.title } })
	windowManager.pingView({ view: 'filemanager', event: events.REFRESH })
	analytics.trackEvent(category, action, label, value)
})

internalEmitter.on(events.UPDATE_PEER_COUNT, (load) => {
	dispatch({ type: events.UPDATE_PEER_COUNT, load })
	windowManager.pingView({ view: 'filemanager', event: events.REFRESH })
	windowManager.pingView({ view: 'purchaseEstimate', event: events.REFRESH, load: { peers: load.peers } })
})

function errorHandler(did) {
	debug('Download failed')
	debug('Dispatching %s', did)
	dispatch({ type: events.DOWNLOAD_FAILED, load: { did } })
	windowManager.pingView({ view: 'filemanager', event: events.REFRESH })
}
