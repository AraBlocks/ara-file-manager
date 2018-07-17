'use strict'

const remote = require('electron').remote
const windowManager = remote.require('electron-window-manager')

module.exports = {
	changeMainManagerSize,
	dispatch,
	closeWindow,
	openModal,
	transitionModal,
	openWindow,
	setWindowSize,
	quitApp
}

function changeMainManagerSize(expand) {
	const window = windowManager.getCurrent().object
	if (expand) {
		window.setSize(400, 525)
	} else {
		window.setSize(400, 325)
	}
}

function dispatch(action, load) {
	windowManager.bridge.emit(action, load)
}

function closeWindow() {
	close()
}

function openModal(view = 'modal') {
	if (windowManager.modalIsOpen) {
		windowManager.get('modal').focus()
	} else {
		const modal = windowManager.open(
			view,
			view,
			windowManager.loadURL(view),
			false,
			{ ...windowManager.setSize(view) }
		)
		modal.object.on('close', () => windowManager.modalIsOpen = false)
		windowManager.modalIsOpen = true
	}
}

function transitionModal(view) {
	const current = windowManager.getCurrent().object
	windowManager.sharedData.set('current', view)

	windowManager.modalIsOpen = false
	openModal(view)
	current.close()
}

function openWindow(view) {
	windowManager.open(
		view,
		view,
		windowManager.loadURL(view),
		false,
		{ ...windowManager.setSize(view) }
	)
}

function setWindowSize(width, height, animated = false) {
	windowManager.getCurrent().object.setSize(width, height, animated)
}

function quitApp() {
	windowManager.closeAll()
}
