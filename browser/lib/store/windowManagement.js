'use strict'

const remote = require('electron').remote
const windowManager = remote.require('electron-window-manager')

module.exports = {
	quitApp() {
		windowManager.closeAll()
	},

	closeWindow() {
		close()
	},

	setWindowSize(windowName, width, height, animated = false) {
		const window = windowManager.get(windowName).object
		window.setSize(width, height, animated)
	}, 
		
	changeMainManagerSize(windowName, expand) {
		const window = windowManager.get(windowName).object
		if (expand) {
			window.setSize(400, 525)
		} else {
			window.setSize(400, 325)
		}
	}
}