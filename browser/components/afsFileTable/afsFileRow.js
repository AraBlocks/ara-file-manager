'use strict'

const filesize = require('filesize')
const menuItem = require('../hamburgerMenu/menuItem')
const styles = require('./styles/afsFileRow')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class AfsFileRow extends Nanocomponent {
	constructor(fileInfo) {
		super()
		this.props = {
			fileInfo,
		}

		this.children = {
			menuItem: this.makeMenu(fileInfo)
		}
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

	fileIconSelector(fileType) {
		let fileName = ''
		switch(fileType) {
			case 'Folder':
				fileName = 'folder.png'
				break
			default:
				fileName = 'file.png'
		}
		return html`<img src="../assets/images/${fileName}" alt="fileIcon" class=${styles.fileImage}>`
	}

	createElement() {
		const { children, props } = this
		return html`
			<tr class="${styles.fileRow} afsFileRow-fileRow">
				<td class="${styles.fileNameCell} afsFileRow-fileNameCell">
					${this.fileIconSelector(props.fileInfo.type)}
					${props.fileInfo.name}
					<div class="${styles.menu} afsFileRow-menu" >
						${children.menuItem.map(item => [
							item.render(),
							html`<div class="${styles.divider} afsFileRow-divider"></div>`
						])}
					</div>
				</td>
				<td>${props.fileInfo.type}</td>
				<td>${filesize(props.fileInfo.size)}</td>
			</tr>
		`
	}
}

module.exports = AfsFileRow