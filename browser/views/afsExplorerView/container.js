'use strict'

const AfsFileTable = require('../../components/afsFileTable/afsFileTable')
const Button = require('../../components/button')
const { emit } = require('../../lib/tools/windowManagement')
const { EXPORT_FILE } = require('../../../lib/constants/stateManagement')
const fileSystemManager = require('../../lib/tools/fileSystemManager')
const overlay = require('../../components/overlay')
const UtilityButton = require('../../components/utilityButton')
const styles = require('./styles/container')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class Container extends Nanocomponent {
	constructor({
		afsName,
		did,
		fileList
	}) {
		super()
		this.props = {
			afsName,
			did
		}
		this.state = {
			fileList
		}
		this.children = {
			afsFileTable: new AfsFileTable({
				did,
				fileList
			}),
			exportAllButton: new Button({
				children: 'Export All',
				cssClass: { opts: { color: 'green' } },
				onclick: this.exportAll.bind(this)
			}),
			downloadUpdateButton: new Button({
				children: 'Download Update',
				cssClass: { name: 'thinBorder' },
				onclick: this.exportAll.bind(this)
			}),
			utilityButton: new UtilityButton({})
		}
	}

	exportAll() {
		const { props } = this
		const { children } = this
		fileSystemManager.showSelectDirectoryDialog()
		.then(folderName => {
			emit({
				event: EXPORT_FILE,
				load: {
					subPath: "",
					did: props.did,
					folderName,
					parentDirectory: children.afsFileTable.state.parentDirectory
				}
			})
		})
	}

	downloadUpdate() {

	}

	update({ fileList }){
		const { state } = this
		if (fileList != null) {
			state.fileList = fileList
		}
		return true
	}

	createElement({ spinner = false }) {
		const { children, props, state } = this
		return html`
			<div class="${styles.container} AfsExplorerViewContainer-container">
				${overlay(spinner)}
				<div class="${styles.horizontalContainer} ${styles.title} AfsExplorerViewContainer-horizontalContainer,title">
					${props.afsName}
					${children.utilityButton.render({ children: '✕' })}
				</div>
				<div class="${styles.content} AfsExplorerViewContainer-content">
					You’re currently viewing the contents of <b>${props.afsName}</b>. You can export files to your hard drive by dragging them out
					from this window, or by clicking “export all”.
				</div>
				<div class="${styles.fileTable} AfsExplorerViewContainer-fileTable">
					${children.afsFileTable.render({ fileList: state.fileList })}
				</div>
				${children.exportAllButton.render({})}
				${children.downloadUpdateButton.render({})}
			</div>
		`
	}
}

module.exports = Container