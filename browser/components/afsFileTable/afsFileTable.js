'use strict'


const AfsFileRow = require('./afsFileRow')
const styles = require('./styles/afsFileTable')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class afsFileTable extends Nanocomponent {
	constructor({
		fileList,
		parentDirectory
	}) {
		super()
		this.props = {
			fileList,
			parentDirectory
		}
		this.children = {
			fileRows: this.makeFileRows(fileList),
			backButton: this.makeBackButton(parentDirectory)
		}
		this.backToParentDirectory = this.backToParentDirectory.bind(this)
	}

	update(){
		return true
	}

	makeBackButton(parentDirectory) {
		const { backToParentDirectory } = this
		return parentDirectory == null ? html`` : html`
			<tr>
				<td colspan=3>
					<div class="${styles.backButton} afsFileTable-backButton" onclick=${backToParentDirectory}>
						${`< Go back to ${parentDirectory}`}
					</div>
					<div class="${styles.divider} afsFileTable-divider"></div>
				</td>
			</tr>
		`
	}

	makeFileRows(fileList) {
		return fileList.map(fileInfo => {
			return new AfsFileRow(fileInfo)
		})
	}

	backToParentDirectory() {
		console.log('back to parent directory')
	}

	createElement() {
		const { children } = this
		return html`
		<div>
			<table class="${styles.container} afsFileTable-container">
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
				${children.backButton}
				${children.fileRows.map(fileRow => fileRow.render())}
			</table>
			</div>
		`
	}
}

module.exports = afsFileTable