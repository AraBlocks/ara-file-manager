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

	setWindowSize(width, height, animated = false) {
		windowManager.getCurrent().object.setSize(width, height, animated)
	},

	changeMainManagerSize(expand) {
		const window = windowManager.getCurrent().object
		if (expand) {
			window.setSize(400, 525)
		} else {
			window.setSize(400, 325)
		}
	}
}