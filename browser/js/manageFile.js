const ManageFileContainer = require('../views/manageFile/container')
const { openModal} = require('../lib/tools/windowManagement')
const {
  ESTIMATING_COST,
  ESTIMATION,
} = require('../../lib/constants/stateManagement')
const { ipcRenderer, remote } = require('electron')

const manageFileContainer = new ManageFileContainer({
	currency: 'USD',
	fileAid: '2ce870ea37886e80df8baf81e584f39b0153163eadc286886e9469dc8d3392bd',
	fileName: 'My Awesome File',
	filePath: '',
	price: null,
	priceManagement: true,
	supernode: false,
	tokenPrice: 9.99,
})
document.getElementById('container').appendChild(manageFileContainer.render({}))
ipcRenderer.on(ESTIMATING_COST, () => manageFileContainer.render({ spinner: true }))
ipcRenderer.on(ESTIMATION, () => openModal('updateConfirmModal'))