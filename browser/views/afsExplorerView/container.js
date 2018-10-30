'use strict'

const AfsFileTable = require('../../components/afsFileTable/afsFileTable')
const Button = require('../../components/button')
const UtilityButton = require('../../components/utilityButton')
const styles = require('./styles/container')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class Container extends Nanocomponent {
	constructor({ afsName, fileList }) {
		super()
		this.props = {
			afsName
		}
		this.state = {
			fileList
		}
		this.children = {
			afsFileDescriptor: new AfsFileTable({
				fileList
			}),
			exportAllButton: new Button({
				children: 'Export All',
				onclick: this.exportAll.bind(this)
			}),
			downloadUpdateButton: new Button({
				children: 'Download Update',
				onclick: this.exportAll.bind(this)
			}),
			utilityButton: new UtilityButton({})
		}
	}

	exportAll() {

	}

	downloadUpdate() {

	}

	update(){
		return true
	}

	createElement() {
		const { children, props } = this
		return html`
			<div class="${styles.container} AfsExplorerViewContainer-container">
				<div class="${styles.horizontalContainer} ${styles.title} AfsExplorerViewContainer-horizontalContainer,title">
					${props.afsName}
					${children.utilityButton.render({ children: '✕' })}
				</div>
				<div class="${styles.content} AfsExplorerViewContainer-content">
					You’re currently viewing the contents of <b>${props.afsName}</b>. You can export files to your hard drive by dragging them out
					from this window, or by clicking “export all”.
				</div>
				<div class="${styles.fileTable} AfsExplorerViewContainer-fileTable">
					${children.afsFileDescriptor.render()}
				</div>
				${children.exportAllButton.render()}
				${children.downloadUpdateButton.render()}
			</div>
		`
	}
}

module.exports = Container