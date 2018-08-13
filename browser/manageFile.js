const ManageFileContainer = require('./views/manageFile/container')
const { remote } = require('electron')
const windowManager = remote.require('electron-window-manager')
const { userData } = windowManager.sharedData.fetch('store')

const manageFileContainer = new ManageFileContainer({
	currency: 'USD',
	fileName: 'My Awesome File',
	filePath: '/Documents/FilePath',
	distributionLink: 'http://ltlstr.com/afsname/ahgaksdhftiaygkjahsdfkjahbc',
	price: 9.99,
	priceManagement: true,
	supernode: false,
	tokenPrice: 9.99,
	userData
})
document.getElementById('container').appendChild(manageFileContainer.render())