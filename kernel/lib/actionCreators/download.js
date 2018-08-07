'use strict'

const dispatch = require('../reducers/dispatch')
const { download } = require('../actions')
const {
	DOWNLOAD,
	DOWNLOADED,
	DOWNLOADED_DEV,
	DOWNLOADING,
	DOWNLOAD_FAILED
} = require('../../../lib/constants/stateManagement')
const { renameAfsFiles, makeAfsPath } = require('../actions/afsManager')
const { ipcMain } = require('electron')
const windowManager = require('electron-window-manager')

ipcMain.on(DOWNLOAD, async (event, load) => {
	dispatch({
    type: DOWNLOADING,
    load: {
				downloadPercent: 0,
				meta: {
					aid: windowManager.fileInfo.aid,
					datePublished: '11/20/1989',
					earnings: 2134.33,
					peers: 353,
					price: windowManager.fileInfo.price,
				},
				name: windowManager.fileInfo.fileName,
				size: 1.67,
				status: 1,
				path: makeAfsPath(windowManager.fileInfo.aid)
			}
	})

	windowManager.get('filemanager').object.webContents.send(DOWNLOADING)

	download({did: windowManager.fileInfo.aid, handler: () => {
		dispatch({
			type: DOWNLOADED,
			load: windowManager.fileInfo.aid
		})
		windowManager.get('filemanager').object.webContents.send(DOWNLOADED)
	}, errorHandler: () => {
		console.log('Download failed')
		dispatch({
			type: DOWNLOAD_FAILED,
			load: windowManager.fileInfo.aid
		})
		windowManager.get('filemanager').object.webContents.send(DOWNLOAD_FAILED)
	}})
})

ipcMain.on(DOWNLOADED_DEV, () => dispatch({ type: DOWNLOADED, load: null }))
