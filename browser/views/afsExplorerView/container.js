'use strict'

const AfsFileTable = require('../../components/afsFileTable/afsFileTable')
const Button = require('../../components/button')
const { emit } = require('../../lib/tools/windowManagement')
const { EXPORT_FILE, CLOSE_AFS_EXPLORER, DOWNLOAD } = require('../../../lib/constants/stateManagement')
const fileSystemManager = require('../../lib/tools/fileSystemManager')
const overlay = require('../../components/overlay')
const UtilityButton = require('../../components/utilityButton')
const styles = require('./styles/container')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')
const windowManagement = require('../../lib/tools/windowManagement')

class Container extends Nanocomponent {
	constructor({
		afsName,
		did,
		fileList,
		updateAvailable
	}) {
		super()
		this.props = {
			afsName,
			did
		}
		this.state = {
			fileList,
			updateAvailable
		}

		this.children = {
			afsFileTable: new AfsFileTable({
				did,
				fileList,
				renderView: this.renderView.bind(this)
			}),
			downloadUpdateButton: new Button({
				children: 'Download Update',
				cssClass: this.state.updateAvailable ? { opts: { color: 'orange' } } : { name: 'thinBorder'},
				onclick: this.state.updateAvailable ? this.downloadUpdate.bind(this) : () => {}
			}),
			exportAllButton: new Button({
				children: 'Export All',
				cssClass: { opts: { color: 'green' } },
				onclick: this.exportAll.bind(this)
			}),
			utilityButton: new UtilityButton({ onclick: () => {
				emit({
					event: CLOSE_AFS_EXPLORER,
					load: { did }
				})
				windowManagement.closeWindow('afsExplorerView')
			}})
		}
	}

	exportAll() {
		const { props } = this
		const { children } = this
		fileSystemManager.showSelectDirectoryDialog()
		.then(folderName => {
			this.render({ spinner: true })
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
		const { props } = this
		emit({
			event: DOWNLOAD,
			load: {
				did: props.did,
			}
		})
		windowManagement.closeWindow('afsExplorerView')
	}

	update({ fileList }){
		const { state } = this
		if (fileList != null) {
			state.fileList = fileList
		}
		return true
	}

	renderView({ spinner = true }) {
		this.render({ spinner })
	}

	createElement({ spinner = false }) {
		const { children, props, state } = this
		return html`
			<div class="${styles.container} AfsExplorerViewContainer-container">
				${overlay(spinner)}
				<div class="${styles.horizontalContainer} ${styles.title} AfsExplorerViewContainer-horizontalContainer,title">
					${props.afsName}
					${children.utilityButton.render({ children: 'close' })}
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