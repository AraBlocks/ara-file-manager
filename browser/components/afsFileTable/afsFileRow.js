'use strict'

const { emit } = require('../../lib/tools/windowManagement')
const { EXPORT_FILE } = require('../../../lib/constants/stateManagement')
const fileSystemManager = require('../../lib/tools/fileSystemManager')
const k = require('../../../lib/constants/stateManagement')
const menuItem = require('../hamburgerMenu/menuItem')
const styles = require('./styles/afsFileRow')
const filesize = require('filesize')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')
const path = require('path')

class AfsFileRow extends Nanocomponent {
	constructor({
		did,
		fileInfo,
		fileRowClicked = () => {},
		deleteFile,
		parentDirectory = [],
		rowType
	}) {
		super()
		this.props = {
			did,
			deleteFile,
			fileInfo,
			fileRowClicked,
			parentDirectory,
			rowType
		}

		this.children = {
			menuItem: this.makeMenu()
		}
		this.fileClicked = this.fileClicked.bind(this)
	}

	update(){
		return true
	}

	makeMenu() {
		const { props } = this
		const items = []
		const exportButton = {
			children: 'Export',
			onclick: this.exportFile.bind(this)
		}
		const deleteButton = {
			children: 'Delete',
			onclick: this.deleteFile.bind(this)
		}

		switch (props.rowType) {
			case k.PUBLISH:
				items.push(deleteButton)
				break
			case k.UPDATE_FILE:
				items.push(exportButton, deleteButton)
				break
			default:
				items.push(exportButton)
				break
		}
		return items.map((item) => new menuItem(item))
	}

	deleteFile(e) {
		const { props } = this
		props.deleteFile({ 
			fileFullPath: props.fileInfo.fullPath,
			fileSubPath: props.fileInfo.subPath
		})
	}

	exportFile(e) {
		const { props } = this
		if (props.did == null) { return }
		e.stopPropagation()
		fileSystemManager.showSelectDirectoryDialog()
			.then(folderName => {
				emit({
					event: EXPORT_FILE,
					load: {
						...props.fileInfo,
						did: props.did,
						folderName,
						parentDirectory: props.parentDirectory
					}
				})
			})
	}

	fileIconSelector(isFile) {
		let fileName = ''
		isFile ? fileName = 'file.png' : fileName = 'folder.png'
		return html`<img src="../assets/images/${fileName}" alt="fileIcon" class=${styles.fileImage}>`
	}

	fileClicked() {
		const { props } = this
		if (props.fileInfo.isFile) { return }
		props.fileRowClicked(props.fileInfo.subPath, props.fileInfo.items)
	}

	renderFileType() {
		const { props } = this
		if (!props.fileInfo.isFile) { return 'Folder' }
		let fileType = path.extname(props.fileInfo.subPath)
		fileType !== ""
		? fileType = `${(fileType.slice(1)).toUpperCase()} File`
		: fileType = "Unknown"
		return fileType
	}

	createElement(index) {
		const { children, fileClicked, props } = this
		return html`
			<tr
				class="${styles.fileRow} afsFileRow-fileRow"
				style="background-color: ${index % 2 ? 'white' : '#f1f1f1'};"
				onclick=${fileClicked}
			>
				<td class="${styles.fileNameCell} afsFileRow-fileNameCell">
					${this.fileIconSelector(props.fileInfo.isFile)}
					${props.fileInfo.subPath}
					<div class="${styles.menu} afsFileRow-menu" >
						${children.menuItem.map(item => [
							item.render(),
							html`<div class="${styles.divider} afsFileRow-divider"></div>`
						])}
					</div>
				</td>
				<td>${this.renderFileType()}</td>
				<td>${filesize(props.fileInfo.size)}</td>
			</tr>
		`
	}
}

module.exports = AfsFileRow