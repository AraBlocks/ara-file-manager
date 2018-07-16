'use strict'

const remote = require('electron').remote
const windowManager = remote.require('electron-window-manager')

module.exports = {
	quitApp() {
		windowManager.closeAll()
	},

	changeMainManagerSize(expand) {
		const window = windowManager.getCurrent().object
		if (expand) {
			window.setSize(400, 525)
		} else {
			window.setSize(400, 325)
		}
	},

	closeWindow() {
		close()
	},

	openModal() {
		console.log('opening modal')
		if (windowManager.modalIsOpen) {

		} else {
			console.log(windowManager.modalIsOpen)
			const hash = 'modal' + Math.random()
			windowManager.open(
				hash,
				hash,
				windowManager.loadURL(),
				false,
				windowManager.setSize(hash),
			)
			windowManager.modalIsOpen = true
		}
	},

	openWindow(view) {
		windowManager.open(
			view,
			view,
			windowManager.loadURL(view),
			false,
			{ ...windowManager.setSize(view) }
		)
	},

	setWindowSize(width, height, animated = false) {
		windowManager.getCurrent().object.setSize(width, height, animated)
	},

}