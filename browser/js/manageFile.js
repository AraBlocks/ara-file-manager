const ManageFileContainer = require('../views/manageFile/container')
const { openModal} = require('../lib/tools/windowManagement')
const {
  ESTIMATING_COST,
	ESTIMATION,
} = require('../../lib/constants/stateManagement')
const { ipcRenderer, remote } = require('electron')
const windowManager = remote.require('electron-window-manager')
const { modal: { manageFileData } } = windowManager.sharedData.fetch('store')

const manageFileContainer = new ManageFileContainer({
	currency: 'ARA',
	fileAid: manageFileData.aid,
	fileName: manageFileData.fileName,
	filePath: '',
	price: manageFileData.price,
	priceManagement: true,
	supernode: false,
	tokenPrice: 9.99,
})
document.getElementById('container').appendChild(manageFileContainer.render({}))

ipcRenderer.on(ESTIMATING_COST, () => manageFileContainer.render({ spinner: true }))
ipcRenderer.on(ESTIMATION, () => openModal('updateConfirmModal'))
