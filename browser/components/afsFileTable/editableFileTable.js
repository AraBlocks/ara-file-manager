'use strict'

const k = require('../../../lib/constants/stateManagement')
const AfsFileRow = require('./afsFileRow')
const fileListSorter = require('../../lib/tools/fileListUtil')
const UtilityButton = require('../../components/utilityButton')
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
		this.state = {
			sortNameReversed: true,
			sortSizeReversed: false,
			sortTypeReversed: false
		}
		this.children = {
			sortFileButton: new UtilityButton({
				children: 'upArrow',
				onclick: this.sortFileName.bind(this)
			}),
			sortTypeButton: new UtilityButton({
				children: 'downArrow',
				onclick: this.sortFileType.bind(this)
			}),
			sortSizeButton: new UtilityButton({
				children: 'downArrow',
				onclick: this.sortFileSize.bind(this)
			}),
		}
		this.onFileDrop = this.onFileDrop.bind(this)
		this.preventDefault = this.preventDefault.bind(this)
		this.deleteFile = this.deleteFile.bind(this)
	}

	update() {
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

	deleteFile(fileInfo) {
		const { props } = this
		props.parentState[props.field] = props.parentState[props.field].filter(file =>
			fileInfo.fullPath == null
				? file.subPath !== fileInfo.subPath
				: file.fullPath !== fileInfo.fullPath
		)
		props.renderView()
	}

	sortFileName() {
		const { props, state } = this
		fileListSorter.sortTextAttribute({
			fileList: props.parentState[props.field],
			attribute: 'subPath',
			reversed: state.sortNameReversed
		})
		state.sortNameReversed = !state.sortNameReversed
		props.renderView()
	}

	sortFileSize() {
		const { props, state } = this
		fileListSorter.sortNumericAttribute({
			fileList: props.parentState[props.field],
			attribute: 'size',
			reversed: state.sortSizeReversed
		})
		state.sortSizeReversed = !state.sortSizeReversed
		props.renderView()
	}

	sortFileType() {
		const { props, state } = this
		fileListSorter.sortFileType({
			fileList: props.parentState[props.field],
			reversed: state.sortTypeReversed
		})
		state.sortTypeReversed = !state.sortTypeReversed
		props.renderView()
	}

	createElement() {
		const tableSize = this.props.tableType === k.UPDATE_FILE ? 225 : 285
		const {
			children,
			preventDefault,
			onFileDrop,
			state
		} = this
		const fileRows = this.makeFileRows()

		return html`
			<div class=${styles.container}
				ondrop=${onFileDrop}
				ondragover=${preventDefault}
				ondragenter=${preventDefault}
				ondragleave=${preventDefault}
			>
				<table class="${styles.fileTable} EditableFileTable-container">
					<thead>
						<tr>
							<th style="width: 350px;">
								<div class="${styles.headerHolder} EditableFileTable-headerHolder">
										Name
										${children.sortFileButton.render({ children: state.sortNameReversed ? 'upArrow' : 'downArrow' })}
								</div>
							</th>
							<th style="width: 99px;">
								<div class="${styles.headerHolder} EditableFileTable-headerHolder">
									Type
									${children.sortTypeButton.render({ children: state.sortTypeReversed ? 'upArrow' : 'downArrow' })}
								</div>
							</th>
							<th style="width: 99px;">
								<div class="${styles.headerHolder} EditableFileTable-headerHolder">
									Size
									${children.sortSizeButton.render({ children: state.sortSizeReversed ? 'upArrow' : 'downArrow' })}
								</div>
							</th>
						</tr>
					</thead>
					<tbody style="height: ${fileRows.length ? tableSize : 0}px;">
						${fileRows.map((fileRow, index) => fileRow.render(index))}
					</tbody>
				</table>
				${fileRows.length === 0
				? html`<div class="${styles.dragDropMsg} editableFileTable-dragDropMsg">Drop files here</div>`
				: null
			}

			</div>
		`
	}
}

module.exports = EditableFileTable