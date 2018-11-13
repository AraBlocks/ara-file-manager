'use strict'

const path = require('path')

module.exports = {
	sortTextAttribute({ attribute, fileList, reversed }) {
		fileList.sort((a, b) => {
			const attribute1 = a[attribute].toUpperCase()
			const attribute2 = b[attribute].toUpperCase()
			if (attribute1 < attribute2) {
				return reversed ? 1 : -1
			} else if (attribute1 > attribute2) {
				return reversed ? -1 : 1
			}
			return 0
		})
	},

	sortNumericAttribute({ attribute, fileList, reversed }) {
		fileList.sort((a, b) => {
			const attribute1 = a[attribute]
			const attribute2 = b[attribute]
			return reversed ? -(attribute1 - attribute2) : (attribute1 - attribute2)
		})
	},

	sortFileType({ fileList, reversed }) {
		fileList.sort((a, b) => {
			const attribute1 = this.getFileType({
				isFile: a.isFile,
				subPath: a.subPath
			})
			const attribute2 = this.getFileType({
				isFile: b.isFile,
				subPath: b.subPath
			})
			if (attribute1 < attribute2) {
				return reversed ? 1 : -1
			} else if (attribute1 > attribute2) {
				return reversed ? -1 : 1
			}
			return 0
		})
	},

	getFileType({ isFile, subPath }) {
		if (!isFile) { return 'Folder' }
		let fileType = path.extname(subPath)
		fileType !== ""
			? fileType = `${(fileType.slice(1)).toUpperCase()} File`
			: fileType = "Unknown"
		return fileType
	}
}