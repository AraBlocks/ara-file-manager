'use strict'

const isDev = require('electron-is-dev')
const {
	clipboard,
	ipcRenderer,
	remote,
	shell
} = require('electron')
const windowManager = remote.require('electron-window-manager')

function changeMainManagerSize(expand) {
	const window = windowManager.getCurrent().object
	window.setSize(400, expand ? 525 : 325)
}

function closeModal(name = null) {
	windowManager.modalIsOpen = false
	closeWindow(name)
}

function closeWindow(name = null) {
	name
		? windowManager.get(name).object.close()
		: windowManager.getCurrent().object.close()
}

function copyToClipboard(text, modifier = (a) => a) {
	clipboard.writeText(modifier(text))
}

function copyDistributionLink(aid, fileName) {
	const encodedName = encodeURIComponent(fileName)
	copyToClipboard(`lstr://download/${aid}/${encodedName}`)
}

function emit({ event, load }) {
	ipcRenderer.send(event, load)
}

function minimizeWindow() {
	windowManager.getCurrent().minimize()
}

function openFolder(path) {
	shell.openItem(path)
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
				backgroundColor: 'white',
				frame: false,
				...windowManager.setSize(view),
			}
		)
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
	windowManager.get(view)
		? windowManager.get(view).focus()
		: windowManager.open(
				view,
				view,
				windowManager.loadURL(view),
				false,
				{
					backgroundColor: 'white',
					frame: false,
					...windowManager.setSize(view)
				}
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
	copyDistributionLink,
	copyToClipboard,
	closeModal,
	closeWindow,
	emit,
	openModal,
	minimizeWindow,
	transitionModal,
	openFolder,
	openWindow,
	setWindowSize,
	quitApp
}
