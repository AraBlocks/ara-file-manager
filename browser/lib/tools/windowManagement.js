'use strict'

const isDev = require('electron-is-dev')
const { ipcRenderer, remote } = require('electron')
const windowManager = remote.require('electron-window-manager')

function changeMainManagerSize(expand) {
	const window = windowManager.getCurrent().object
	if (expand) {
		window.setSize(400, 525)
	} else {
		window.setSize(400, 325)
	}
}

function closeWindow() {
	windowManager.getCurrent().close()
}

function emit({ event, load }) {
	ipcRenderer.send(event, load)
}

function minimizeWindow() {
	windowManager.getCurrent().minimize()
}

function openModal(view = 'modal') {
	if (windowManager.modalIsOpen) {
		windowManager.get('modal').focus()
	} else {
		windowManager.sharedData.set('current', view)
		const modal = windowManager.open(
			view,
			view,
			windowManager.loadURL(view),
			false,
			{
				frame: false,
				...windowManager.setSize(view),
			},
			!isDev
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
		{
			frame: false,
			...windowManager.setSize(view)
		},
		!isDev
	)
}

function setWindowSize(width, height, animated = false) {
	windowManager.getCurrent().object.setSize(width, height, animated)
}

function quitApp() {
	windowManager.closeAll()
}

module.exports = {
	changeMainManagerSize,
	closeWindow,
	emit,
	openModal,
	minimizeWindow,
	transitionModal,
	openWindow,
	setWindowSize,
	quitApp
}
