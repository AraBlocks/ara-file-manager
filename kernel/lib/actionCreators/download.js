'use strict'

const { download } = require('../actions')
const { DOWNLOAD, DOWNLOADED, DOWNLOADING } = require('../../../lib/constants/stateManagement')
const windowManager = require('electron-window-manager')

windowManager.bridge.on(DOWNLOAD, async (load) => {
  windowManager.bridge.emit(DOWNLOADING)
	download({did: load, handler: () => {
		windowManager.bridge.emit(DOWNLOADED)
	}})
})