'use strict'

const dispatch = require('../reducers/dispatch')
const { afsManager } = require('../actions')
const {
	DOWNLOAD,
	DOWNLOADED,
	DOWNLOADING,
	DOWNLOAD_COMPLETE,
	DOWNLOAD_FAILED,
	DOWNLOAD_START
} = require('../../../lib/constants/stateManagement')
const { makeAfsPath } = require('../actions/afsManager')
const { ipcMain } = require('electron')
const windowManager = require('electron-window-manager')

ipcMain.on(DOWNLOAD, async (event, load) => {
	dispatch({
    type: DOWNLOAD_START,
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
				size: 0,
				status: 1,
				path: makeAfsPath(windowManager.fileInfo.aid)
			}
	})

	dispatch({ type: DOWNLOAD_COMPLETE, load: windowManager.fileInfo.price})
	afsManager.download({did: windowManager.fileInfo.aid, handler: (load) => {
		if (load.percentage !== 1) {
			dispatch({
				type: DOWNLOADING,
				load
			})
			windowManager.get('filemanager').object.webContents.send(DOWNLOADING)
		} else {
			dispatch({
				type: DOWNLOADED,
				load: windowManager.fileInfo.aid
			})
			windowManager.get('filemanager').object.webContents.send(DOWNLOADED)
		}
	}, errorHandler: () => {
		console.log('Download failed')
		dispatch({
			type: DOWNLOAD_FAILED,
			load: windowManager.fileInfo.aid
		})
		windowManager.get('filemanager').object.webContents.send(DOWNLOAD_FAILED)
	}})
})