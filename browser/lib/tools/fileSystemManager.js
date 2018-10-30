'use strict'

const remote = require('electron').remote
const { dialog } = remote

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
	},

	showSelectDirectoryDialog() {
		const opts = {
			properties: [
				'openDirectory',
			]
		}
		return new Promise((resolve, reject) => {
			dialog.showOpenDialog(opts, (folderName, error) => {
				folderName ? resolve(folderName) : reject(error)
			})
		})
	}
}