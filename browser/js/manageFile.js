const ManageFileContainer = require('../views/manageFile/container')
const {
	ESTIMATING_COST,
	ESTIMATION,
	REFRESH
} = require('../../lib/constants/stateManagement')
const { openModal } = require('../lib/tools/windowManagement')
const { ipcRenderer, remote } = require('electron')
const windowManager = remote.require('electron-window-manager')
const { modal } = windowManager.sharedData.fetch('store')

const manageFileContainer = new ManageFileContainer({
	currency: 'ARA',
	did: modal.manageFileData.did,
	fileList: modal.manageFileData.fileList,
	name: modal.manageFileData.name,
	price: modal.manageFileData.price
})
document.getElementById('container').appendChild(manageFileContainer.render({ spinner: (modal.manageFileData.fileList === 0) }))

ipcRenderer.on(ESTIMATING_COST, () => manageFileContainer.render({ spinner: true }))
ipcRenderer.on(ESTIMATION, () => openModal('updateConfirmModal'))
ipcRenderer.on(REFRESH, () => manageFileContainer.render({ spinner: false, fileList: modal.manageFileData.fileList }))
