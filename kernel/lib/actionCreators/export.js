'use strict'

const debug = require('debug')('acm:kernel:lib:actionCreators:export')
const dispatch = require('../reducers/dispatch')
const { afsManager } = require('../actions')
const k = require('../../../lib/constants/stateManagement')
const { ipcMain } = require('electron')
const windowManager = require('electron-window-manager')
const store = windowManager.sharedData.fetch('store')
const path = require('path')

ipcMain.on(k.EXPORT_FILE, async (event, load) => {
	debug('%s heard', k.EXPORT_FILE)
	try {
		const fileDirectory = load.parentDirectory.reduce((fullPath, subpath) => path.join(fullPath, subpath), "")
		const filePath = path.join(fileDirectory, load.subPath)
		const exportPath = path.join(load.folderName[0], load.subPath)
		if (load.isFile) {
			afsManager.exportFile({
				did: load.did,
				exportPath,
				filePath
			})
		} else {
			afsManager.exportFolder({
				did: load.did,
				exportPath,
				folderPath: filePath
			})
		}
	} catch (err) {
		debug('Error: %O', err)
	}
})