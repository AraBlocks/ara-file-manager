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

	openModal(view = 'modal') {
		if (windowManager.modalIsOpen) {
			windowManager.get('modal').focus()
		} else {
			const modal = windowManager.open(
				view,
				view,
				windowManager.loadURL(view),
				false,
				{ ... windowManager.setSize(view) }
			)
			modal.object.on('close', () => windowManager.modalIsOpen = false)
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