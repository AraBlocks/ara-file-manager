const ManageFileContainer = require('../views/manageFile/container')
const { openModal} = require('../lib/tools/windowManagement')
const {
  ESTIMATING_COST,
	ESTIMATION,
	FEED_MANAGE_FILE
} = require('../../lib/constants/stateManagement')
const { ipcRenderer, remote } = require('electron')
const windowManager = remote.require('electron-window-manager')

const manageFileContainer = new ManageFileContainer({
	currency: 'ARA',
	fileAid: '',
	fileName: '',
	filePath: '',
	price: null,
	priceManagement: true,
	supernode: false,
	tokenPrice: 9.99,
})
document.getElementById('container').appendChild(manageFileContainer.render({}))
ipcRenderer.on(ESTIMATING_COST, () => manageFileContainer.render({ spinner: true }))
ipcRenderer.on(ESTIMATION, () => openModal('updateConfirmModal'))
windowManager.bridge.on(FEED_MANAGE_FILE, load => {
	manageFileContainer.state.fileAid = load.aid
	manageFileContainer.state.fileName = load.fileName
	manageFileContainer.state.price = load.price
	manageFileContainer.render({})
})