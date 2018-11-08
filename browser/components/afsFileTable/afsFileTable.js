'use strict'


const AfsFileRow = require('./afsFileRow')
const k = require('../../../lib/constants/stateManagement')
const styles = require('./styles/AfsFileTable')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class AfsFileTable extends Nanocomponent {
	constructor({
		did,
		fileList
	}) {
		super()
		this.state = {
			currentFileList: fileList,
			parentDirectory: []
		}
		this.props = {
			did,
			fileList,
		}
		this.backToParentDirectory = this.backToParentDirectory.bind(this)
	}

	update({ fileList }) {
		const { props } = this
		if (props.fileList.length === 0) {
			props.fileList = fileList
			this.state.currentFileList = fileList
		}
		return true
	}

	makeBackButton() {
		const { backToParentDirectory, state } = this
		return state.parentDirectory.length === 0 ? html`` : html`
			<tr>
				<td colspan=3>
					<div class="${styles.backButton} AfsFileTable-backButton" onclick=${backToParentDirectory}>
						${`< Go back to ${state.parentDirectory[state.parentDirectory.length - 1]}`}
					</div>
					<div class="${styles.divider} AfsFileTable-divider"></div>
				</td>
			</tr>
		`
	}

	fileRowClicked(parentDirectory, fileList) {
		const { state } = this
		state.parentDirectory.push(parentDirectory)
		state.currentFileList = fileList
		this.render({})
	}

	makeFileRows() {
		const { state } = this
		const { props } = this
		return state.currentFileList.map(fileInfo => new AfsFileRow({
			did: props.did,
			fileInfo,
			fileRowClicked: this.fileRowClicked.bind(this),
			parentDirectory: state.parentDirectory,
			rowType: k.DOWNLOADED
		}))
	}

	backToParentDirectory() {
		const { state } = this
		state.parentDirectory.pop()
		state.currentFileList = this.getCurrentFiles(state.parentDirectory)
		this.render({})
	}

	getCurrentFiles(parentList) {
		const { props } = this
		let fileList = props.fileList
		parentList.forEach(parentPath => {
			fileList = fileList.find(file => file.subPath === parentPath).items
		})
		return fileList
	}

	createElement() {
		const fileRows = this.makeFileRows()
		const backButton = this.makeBackButton()
		return html`
		<div>
			<div class="${styles.headerHolder} afsFileTable-headerHolder">
				<div class="${styles.nameHeader} afsFileTable-nameHeader">Name</div>
				<div class="${styles.typeHeader} afsFileTable-typeHeader">Type</div>
				<div class="${styles.sizeHeader} afsFileTable-sizeHeader">Size</div>
			</div>
			<table class="${styles.container} AfsFileTable-container">
				${backButton}
				<tbody>
					${fileRows.map((fileRow, index) => fileRow.render(index))}
				</tbody>
			</table>
			</div>
		`
	}
}

module.exports = AfsFileTable