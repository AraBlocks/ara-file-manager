'use strict'

const dispatch = require('../reducers/dispatch')
const { download } = require('../actions')
const { DOWNLOAD, DOWNLOADED, DOWNLOADING } = require('../../../lib/constants/stateManagement')
const { ipcMain } = require('electron')
const windowManager = require('electron-window-manager')

ipcMain.on(DOWNLOAD, async (event, load) => {
	windowManager.get('filemanager').object.webContents.send(DOWNLOADING)
	const newState = dispatch({
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
			}
	})
	windowManager.get('filemanager').object.webContents.send(DOWNLOADED, windowManager.fileInfo.aid)
	download({did: load, handler: () => {
		const newload = {
			downloadPercent: 1,
			meta: {
				aid: windowManager.fileInfo.aid,
				datePublished: '11/20/1989',
				earnings: 2134.33,
				peers: 353,
				price: windowManager.fileInfo.price,
			},
			name: windowManager.fileInfo.fileName,
			size: 1.67,
			status: 2,
		}
		windowManager.get('filemanager').object.webContents.send(DOWNLOADED, newload)
	}})
})

ipcMain.on(DOWNLOADED, async(event, load) => {
	console.log('\n\n\n\naloha')
	const newState = dispatch({
		type: DOWNLOADED,
		load
	})
})