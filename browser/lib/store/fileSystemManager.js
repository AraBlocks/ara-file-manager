'use strict'

const remote = require('electron').remote
const dialog = remote.dialog

module.exports = {
	showSelectFileDialog() {
		const opts = {
			properties: [
				'openFile',
				'openDirectory',
				'multiSelections'
			]
		}
		return new Promise((resolve, reject) => {
			dialog.showOpenDialog(opts, (fileNames, error) => {
				fileNames ? resolve(fileNames) : reject(error)
			})
		})
	}
}