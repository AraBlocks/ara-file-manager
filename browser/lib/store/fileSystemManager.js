'use strict'

const remote = require('electron').remote
const dialog = remote.dialog

module.exports = {
	showSelectFileDialog() {
		return new Promise((resolve, reject) => {
			dialog.showOpenDialog((fileNames, error) => {
				fileNames ? resolve(fileNames) : reject(error)
			})
		})
	}
}