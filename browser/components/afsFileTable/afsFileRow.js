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

	createElement() {
		const { props } = this
		return html`
			<tr
				class="${styles.fileRow} afsFileRow-fileRow"
			>
				<td class="${styles.fileNameCell} afsFileRow-fileNameCell">
					<img src="../assets/images/folder.png" alt="fileIcon" class=${styles.fileImage}>
					${props.fileInfo.name}
					<div class="${styles.menu} afsFileRow-menu" >
						${props.menuItem.map(item => [
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