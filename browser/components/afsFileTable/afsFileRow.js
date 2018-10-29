'use strict'

const filesize = require('filesize')
const menuItem = require('../hamburgerMenu/menuItem')
const styles = require('./styles/afsFileRow')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class AfsFileRow extends Nanocomponent {
	constructor({
		fileInfo,
		fileRowClicked
	}) {
		super()
		this.props = {
			fileInfo,
			fileRowClicked
		}

		this.children = {
			menuItem: this.makeMenu(fileInfo)
		}
		this.onclick = this.onclick.bind(this)
	}

	update(){
		return true
	}

	makeMenu(fileInfo) {
		const items = [
			{ children: 'Export', onclick: () => {} },
			{ children: 'Delete', onclick: () => {} }
		]
		return items.map((item) => new menuItem(item))
	}

	fileIconSelector(isFile) {
		let fileName = ''
		if (isFile) {
			fileName = 'file.png'
		} else {
			fileName = 'folder.png'
		}
		return html`<img src="../assets/images/${fileName}" alt="fileIcon" class=${styles.fileImage}>`
	}

	onclick() {
		const { props } = this
		if (props.fileInfo.isFile) { return }
		props.fileRowClicked(props.fileInfo.subPath, props.fileInfo.items)
	}

	createElement() {
		const { children, onclick, props } = this
		return html`
			<tr
				class="${styles.fileRow} afsFileRow-fileRow"
				onclick=${onclick}
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
				<td>${props.fileInfo.type ? 'File' : 'Folder'}</td>
				<td>${filesize(props.fileInfo.size)}</td>
			</tr>
		`
	}
}

module.exports = AfsFileRow