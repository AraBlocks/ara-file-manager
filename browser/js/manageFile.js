const ManageFileContainer = require('../views/manageFile/container')
const {
	ESTIMATING_COST,
	ESTIMATION,
	REFRESH
} = require('../../lib/constants/stateManagement')
const { openModal } = require('../lib/tools/windowManagement')
const { ipcRenderer, remote } = require('electron')
const windowManager = remote.require('electron-window-manager')
const store = windowManager.sharedData.fetch('store')
const { modal: { manageFileData } } = windowManager.sharedData.fetch('store')

const manageFileContainer = new ManageFileContainer({
	currency: 'ARA',
	did: manageFileData.did,
	name: manageFileData.name,
	price: manageFileData.price
})
document.getElementById('container').appendChild(manageFileContainer.render({ spinner: true }))

ipcRenderer.on(ESTIMATING_COST, () => manageFileContainer.render({ spinner: true }))
ipcRenderer.on(ESTIMATION, () => openModal('updateConfirmModal'))
ipcRenderer.on(REFRESH, () => manageFileContainer.render({ spinner: false, fileList: store.modal.manageFileData.fileList }))
