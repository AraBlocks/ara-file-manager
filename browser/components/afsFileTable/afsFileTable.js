'use strict'


const AfsFileRow = require('./afsFileRow')
const styles = require('./styles/AfsFileTable')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class AfsFileTable extends Nanocomponent {
	constructor({
		fileList
	}) {
		super()
		this.state = {
			currentFileList: fileList,
			parentDirectory: []
		}
		this.props = {
			fileList,
		}
		this.backToParentDirectory = this.backToParentDirectory.bind(this)
	}

	update(){
		return true
	}

	makeBackButton(parentDirectory) {
		const { backToParentDirectory, state } = this
		return state.parentDirectory.length === 0 ? html`` : html`
			<tr>
				<td colspan=3>
					<div class="${styles.backButton} AfsFileTable-backButton" onclick=${backToParentDirectory}>
						${`< Go back to ${parentDirectory[parentDirectory.length - 1]}`}
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
		this.render({
			currentFileList: fileList,
			parentDirectory: state.parentDirectory
		})
	}

	makeFileRows(fileList) {
		return fileList.map(fileInfo => new AfsFileRow({ fileInfo, fileRowClicked: this.fileRowClicked.bind(this)}))
	}

	backToParentDirectory() {
		const { state } = this
		state.parentDirectory.pop()
		state.currentFileList = this.getCurrentFiles(state.parentDirectory)
		this.render({
			currentFileList: state.currentFileList,
			parentDirectory: state.parentDirectory
		})
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
		const { state } = this
 		const fileRows = this.makeFileRows(state.currentFileList)
		const backButton = this.makeBackButton(state.parentDirectory)
		return html`
		<div>
			<table class="${styles.container} AfsFileTable-container">
				<colgroup>
					<col span="1" style="width: 40%;">
					<col span="1" style="width: 30%;">
					<col span="1" style="width: 30%;">
	 			</colgroup>
				<tr>
					<th>Name</th>
					<th>Type</th>
					<th>Size</th>
				</tr>
				${backButton}
				${fileRows.map(fileRow => fileRow.render())}
			</table>
			</div>
		`
	}
}

module.exports = AfsFileTable