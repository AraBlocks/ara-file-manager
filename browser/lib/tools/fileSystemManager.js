const remote = require('electron').remote
const { dialog } = remote
const fs = require('fs')

module.exports = {
	getFileInfo(file) {
		const stats = fs.statSync(file)
		const size = stats.size
		const isFile = !stats.isDirectory()
		const pathArray = file.split('/')
		const subPath =  pathArray[pathArray.length - 1]

		return {
			isFile,
			subPath,
			fullPath: file,
			size
		}
	},

	showSelectFileDialog() {
		const opts = {
			properties: [
				'openFile',
				'multiSelections'
			]
		}
		return new Promise((resolve) => {
			dialog.showOpenDialog(opts, (fileNames, error) =>
				fileNames ? resolve(fileNames) : resolve([])
			)
		})
	},

	showSelectFileAndFolderDialog() {
		const opts = {
			properties: [
				'openFile',
				'openDirectory',
				'multiSelections'
			]
		}
		return new Promise((resolve) => {
			dialog.showOpenDialog(opts, (fileNames, error) =>
				fileNames ? resolve(fileNames) : resolve([])
			)
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