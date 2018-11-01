'use strict'

const { emit } = require('../../lib/tools/windowManagement')
const { EXPORT_FILE } = require('../../../lib/constants/stateManagement')
const fileSystemManager = require('../../lib/tools/fileSystemManager')
const menuItem = require('../hamburgerMenu/menuItem')
const styles = require('./styles/afsFileRow')
const filesize = require('filesize')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class AfsFileRow extends Nanocomponent {
	constructor({
		did,
		fileInfo,
		fileRowClicked,
		parentDirectory,
	}) {
		super()
		this.props = {
			did,
			fileInfo,
			fileRowClicked,
			parentDirectory,
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
		const items = [
			{
				children: 'Export',
				onclick: this.exportFile.bind(this)
			}
		]
		return items.map((item) => new menuItem(item))
	}

	exportFile(e) {
		const { props } = this
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

		const fileNameSplit = props.fileInfo.subPath.split('.')
		let fileType = ""
		fileNameSplit.length >= 2
		? fileType = `${fileNameSplit[fileNameSplit.length - 1].toUpperCase()} File`
		: fileType = "Unknown"
		return fileType
	}

	createElement() {
		const { children, fileClicked, props } = this
		return html`
			<tr
				class="${styles.fileRow} afsFileRow-fileRow"
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