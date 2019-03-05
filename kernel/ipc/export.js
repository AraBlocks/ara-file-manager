const debug = require('debug')('ara:fm:kernel:ipc:export')

const { events } = require('k')
const { ipcMain } = require('electron')
const path = require('path')
const windowManager = require('electron-window-manager')

const { afs } = require('../daemons')

ipcMain.on(events.EXPORT_FILE, async (_, load) => {
	debug('%s heard', events.EXPORT_FILE)
	try {
		const fileDirectory = path.join(...load.parentDirectory)
		const filePath = path.join(fileDirectory, load.subPath)
		const exportPath = path.join(load.folderName[0], load.subPath)
		if (load.isFile) {
			afs.exportFile({
				did: load.did,
				exportPath,
				filePath,
				completeHandler
			})
		} else {
			afs.exportFolder({
				did: load.did,
				exportPath,
				folderPath: filePath,
				completeHandler
			})
		}
	} catch (err) {
		debug('Error: %O', err)
	}
})

function completeHandler() {
	windowManager.pingView({ view: 'afsExplorerView', event: events.REFRESH })
}