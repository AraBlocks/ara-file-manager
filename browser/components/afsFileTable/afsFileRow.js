const { emit } = require('../../lib/tools/windowManagement')
const fileSystemManager = require('../../lib/tools/fileSystemManager')
const fileListUtil = require('../../lib/tools/fileListUtil')
const { events } = require('events')
const styles = require('./styles/afsFileRow')
const filesize = require('filesize')
const html = require('nanohtml')
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
			case events.PUBLISH:
				menu = html`
					<div class="${styles.contextMenu} editableFileTable-contextMenu" id="context-menu">
						<div class="${styles.menuItem}" onclick=${this.deleteFile.bind(this)}>Delete</div>
					</div>
				`
				break
			case events.UPDATE_FILE:
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
					event: events.EXPORT_FILE,
					load: {
						...props.fileInfo,
						did: props.did,
						folderName,
						parentDirectory: props.parentDirectory
					}
				})
			})
			.catch(() => {})
		this.rerender()
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

	fileClicked(e) {
		const { props } = this
		return props.fileInfo.isFile === false
			? props.fileRowClicked(props.fileInfo.subPath, props.fileInfo.items)
			: this.exportFile(e)
	}

	renderFileType() {
		const { props } = this
		return fileListUtil.getFileType({ isFile: props.fileInfo.isFile, subPath: props.fileInfo.subPath })
	}

	renderContextMenu(e) {
		const contextMenu = e.target.closest('tr').children[0]

		contextMenu.style.left = e.clientX - 10 + 'px'
		contextMenu.style.top = e.clientY - 10 + 'px'
		contextMenu.style.display = 'block'

		contextMenu.addEventListener('mouseout', function (event) {
			try {
				const e = event.toElement || event.relatedTarget
				e.parentNode == this || e == this
					? null
					: contextMenu.style.display = 'none'
			} catch (e) {}
		})
	}

	createElement() {
		const {
			fileClicked,
			children,
			props,
			renderContextMenu
		} = this

		return html`
			<tr
				class="item afsFileRow-item"
				onclick="${fileClicked}"
				oncontextmenu="${renderContextMenu}"
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