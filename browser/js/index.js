const { remote } = require('electron')
const windowManager = remote.require('electron-window-manager')
const { files } = windowManager.sharedData.fetch('store')

const MainManager = require('../views/mainManager/container')
const mainManager = new MainManager({
	walletInfo: {
		araOwned: 9999,
		exchangeRate: 1.73
	},
	files: files.published
})
document.getElementById('container').appendChild(mainManager.render())