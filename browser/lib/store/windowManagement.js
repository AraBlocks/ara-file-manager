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
		let window = windowManager.get(windowName).object
		window.setSize(width, height, animated)
	}, 
	
	getHeight(windowName) {
		let window = windowManager.get(windowName).object
		return window.getSize()[1]
	}
}