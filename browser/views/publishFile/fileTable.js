'use strict'


const AfsFileRow = require('../../components/afsFileTable/afsFileRow')
const Drag = require('../../components/dragDropArea')
const styles = require('./styles/fileTable')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')
const path = require('path')
const fs = require('fs')

class FileTable extends Nanocomponent {
	constructor() {
		super()
		this.state = {
			fileList: []
		}
		this.ondrop = this.ondrop.bind(this)
		this.preventDefault = this.preventDefault.bind(this)
		this.drag = new Drag({
			onFileDrop: () => { console.log('dropped') }
		})
	}

	update(){
		return true
	}

	makeFileRows() {
		const { state } = this
		return state.fileList.map(fileInfo => new AfsFileRow({
			fileInfo,
		}))
	}

	preventDefault(e) {
		e.preventDefault()
		e.stopPropagation()
	}

	ondrop(e) {
		const { props } = this
		this.preventDefault(e)
		const { state } = this
	 	const file = e.dataTransfer.files[0]
		console.log(file)
		const fileData = {
			isFile: file.type !== "",
			subPath: file.name,
			fullPath: file.path,
			size: file.size
		}
		console.log(fileData)
		state.fileList.push(fileData)
		this.render()
	}


	createElement() {
		const { preventDefault, ondrop, drag } = this
 		const fileRows = this.makeFileRows()
		return html`
		<div class=${styles.container}
			ondrop=${ondrop}
			ondragover=${preventDefault}
			ondragenter=${preventDefault}
			ondragleave=${preventDefault}
		>
			<table class="${styles.fileTable} FileTable-container">
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

module.exports = FileTable