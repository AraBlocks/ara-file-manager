'use strict'


const AfsFileRow = require('./afsFileRow')
const styles = require('./styles/editableFileTable')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class EditableFileTable extends Nanocomponent {
	constructor({
		did,
		field,
		parentState,
		renderView,
		tableType
	}) {
		super()
		this.props = {
			did,
			field,
			parentState,
			renderView,
			tableType
		}
		this.onFileDrop = this.onFileDrop.bind(this)
		this.preventDefault = this.preventDefault.bind(this)
		this.deleteFile = this.deleteFile.bind(this)
	}

	update(){
		return true
	}

	makeFileRows() {
		const { props, deleteFile } = this
		return props.parentState[props.field].map(fileInfo => new AfsFileRow({
			did: props.did,
			fileInfo,
			deleteFile,
			rowType: props.tableType
		}))
	}

	preventDefault(e) {
		e.preventDefault()
		e.stopPropagation()
	}

	onFileDrop(e) {
		this.preventDefault(e)
		const { props } = this
		const rawFileData = e.dataTransfer.files
		const fileData = Array.from(rawFileData).map(file => {
			return {
				isFile: file.type !== "",
				subPath: file.name,
				fullPath: file.path,
				size: file.size
			}
		})
		props.parentState[props.field].push(...fileData)
		props.renderView()
	}

	deleteFile({ fileFullPath, fileSubPath }) {
		const { props } = this
		props.parentState[props.field] = props.parentState[props.field].filter(file =>
			fileFullPath == null
				? file.subPath !== fileSubPath
				: file.fullPath !== fileFullPath
		)
		props.renderView()
	}

	createElement() {
		const { preventDefault, onFileDrop } = this
 		const fileRows = this.makeFileRows()
		return html`
		<div class=${styles.container}
			ondrop=${onFileDrop}
			ondragover=${preventDefault}
			ondragenter=${preventDefault}
			ondragleave=${preventDefault}
		>
			<table class="${styles.fileTable} EditableFileTable-container">
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
				${fileRows.map(fileRow => fileRow.render())}
			</table>
		</div>
		`
	}
}

module.exports = EditableFileTable