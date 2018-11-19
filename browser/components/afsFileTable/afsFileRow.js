'use strict'

const { emit } = require('../../lib/tools/windowManagement')
const { EXPORT_FILE } = require('../../../lib/constants/stateManagement')
const fileSystemManager = require('../../lib/tools/fileSystemManager')
const fileListUtil = require('../../lib/tools/fileListUtil')
const k = require('../../../lib/constants/stateManagement')
const styles = require('./styles/afsFileRow')
const filesize = require('filesize')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')


class AfsFileRow extends Nanocomponent {
	constructor({
		did,
		fileInfo,
		fileRowClicked = () => {},
		deleteFile,
		parentDirectory = [],
		rowType,
		renderView
	}) {
		super()
		this.props = {
			did,
			deleteFile,
			fileInfo,
			fileRowClicked,
			parentDirectory,
			rowType,
			renderView
		}

		this.children = {
			menuItem: this.makeMenu()
		}
		this.fileClicked = this.fileClicked.bind(this)
		this.exportFile = this.exportFile.bind(this)
	}

	update() {
		return true
	}

	makeMenu() {
		const { props } = this

		let menu
		switch (props.rowType) {
			case k.PUBLISH:
				menu = html`
					<div class="${styles.contextMenu} editableFileTable-contextMenu" id="context-menu">
						<div class="${styles.menuItem}" onclick=${this.deleteFile.bind(this)}>Delete</div>
					</div>
				`
				break
			case k.UPDATE_FILE:
				menu = html`
					<div class="${styles.contextMenu} editableFileTable-contextMenu" id="context-menu">
						<div class="${styles.menuItem}" style="border-bottom: none;" onclick=${this.exportFile.bind(this)}>Export</div>
						<div class="${styles.menuItem}" onclick=${this.deleteFile.bind(this)}>Delete</div>
					</div>
				`
				break
			default:
				menu = html`
					<div class="${styles.contextMenu} editableFileTable-contextMenu" id="context-menu">
						<div class="${styles.menuItem}" onclick=${this.exportFile.bind(this)}>Export</div>
					</div>
				`
				break
		}
		return menu
	}

	deleteFile(e) {
		const { props } = this
		props.deleteFile(props.fileInfo)
	}

	exportFile(e) {
		const { props } = this
		if (props.did == null) { return }
		e.stopPropagation()
		e.target.parentNode.style.display = 'none'

		fileSystemManager.showSelectDirectoryDialog()
			.then(folderName => {
				props.renderView({ spinner: true })
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
			.catch(() => {})
	}

	fileIconSelector(isFile) {
		return html`
			<img
				align="center"
				src="../assets/images/${isFile ? 'file.png' : 'folder.png'}"
				alt="fileIcon"
				class=${styles.fileImage}
			>
		`
	}

	fileClicked() {
		const { props } = this
		return props.fileInfo.isFile === false
			? props.fileRowClicked(props.fileInfo.subPath, props.fileInfo.items)
			: null
	}

	renderFileType() {
		const { props } = this
		return fileListUtil.getFileType({ isFile: props.fileInfo.isFile, subPath: props.fileInfo.subPath })
	}

	renderContextMenu(e) {
		const contextMenu = e.target.closest('tr').children[0]
		contextMenu.style.left = e.clientX + 1 + 'px'
		contextMenu.style.top = e.clientY + 1 + 'px'
		contextMenu.style.display = 'block'
		contextMenu.addEventListener('mouseout', function (event) {
			try {
				const e = event.toElement || event.relatedTarget;
				e.parentNode == this || e == this
					? null
					: contextMenu.style.display = 'none'
			} catch (e) {}
		})
	}

	createElement(index) {
		const {
			fileClicked,
			children,
			props,
			renderContextMenu
		} = this

		return html`
			<tr
				style="background-color: ${index % 2 ? 'white' : '#f1f1f1'};"
				class="item afsFileRow-item"
				onclick=${fileClicked}
				oncontextmenu=${renderContextMenu}
			>
				${children.menuItem}
				<td class="${styles.fileNameCell} afsFileRow-fileNameCell" >
					${this.fileIconSelector(props.fileInfo.isFile)}
					${props.fileInfo.subPath}
				</td>
				<td style="width: 100px;">${this.renderFileType()}</td>
				<td>${filesize(props.fileInfo.size)}</td>
			</tr>
		`
	}
}

module.exports = AfsFileRow