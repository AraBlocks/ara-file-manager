const ManageFileContainer = require('../views/manageFile/container')
const k = require('../../lib/constants/stateManagement')
const windowManagement = require('../lib/tools/windowManagement')
const { ipcRenderer, remote } = require('electron')
const windowManager = remote.require('electron-window-manager')
const { account, modal } = windowManager.sharedData.fetch('store')

const manageFileContainer = new ManageFileContainer({
	account,
	did: modal.manageFileData.did,
	fileList: modal.manageFileData.fileList,
	name: modal.manageFileData.name,
	price: modal.manageFileData.price,
	uncommitted: modal.manageFileData.uncommitted
})

document.getElementById('container').appendChild(manageFileContainer.render({ spinner: !modal.manageFileData.uncommitted }))

ipcRenderer.on(k.ESTIMATING_COST, () => manageFileContainer.render({ spinner: true }))
ipcRenderer.on(k.ESTIMATION, () => windowManagement.openModal('updateConfirmModal'))
ipcRenderer.on(k.REFRESH, () => manageFileContainer.render({ spinner: false, fileList: modal.manageFileData.fileList }))

window.onunload = () => {
	!modal.manageFileData.uncommitted
		&& windowManagement.emit({ event: k.START_SEEDING, load: { did: modal.manageFileData.did } })
}