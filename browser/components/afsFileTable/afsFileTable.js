
const AfsFileRow = require('./afsFileRow')
const { events } = require('k')
const fileListSorter = require('../../lib/tools/fileListUtil')
const UtilityButton = require('../../components/utilityButton')
const styles = require('./styles/afsFileTable')
const html = require('nanohtml')
const Nanocomponent = require('nanocomponent')

class AfsFileTable extends Nanocomponent {
	constructor({ did, fileList, renderView, }) {
		super()

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
		this.state = {
			currentFileList: fileList,
			parentDirectory: [],
			sortNameReversed: true,
			sortSizeReversed: false,
			sortTypeReversed: false
		}
		this.props = {
			did,
			fileList,
			renderView
		}
		this.backToParentDirectory = this.backToParentDirectory.bind(this)
		this.sortFileName = this.sortFileName.bind(this)
		this.sortFileType = this.sortFileType.bind(this)
		this.sortFileSize = this.sortFileSize.bind(this)
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

	sortFileName() {
		const { state } = this
		fileListSorter.sortTextAttribute({
			fileList: state.currentFileList,
			attribute: 'subPath',
			reversed: state.sortNameReversed
		})
		state.sortNameReversed = !state.sortNameReversed
		this.render({})
	}

	 sortFileSize() {
		 const { state } = this
		 fileListSorter.sortNumericAttribute({
			 fileList: state.currentFileList,
			 attribute: 'size',
			 reversed: state.sortSizeReversed
		 })
		 state.sortSizeReversed = !state.sortSizeReversed
		 this.render({})
	}

	sortFileType() {
		const { state } = this
		fileListSorter.sortFileType({
			fileList: state.currentFileList,
			reversed: state.sortTypeReversed
		})
		state.sortTypeReversed = !state.sortTypeReversed
		this.render({})
	}

	fileRowClicked(parentDirectory, fileList) {
		const { state } = this
		state.parentDirectory.push(parentDirectory)
		state.currentFileList = fileList
		this.render({})
	}

	makeFileRows() {
		const { props, state } = this
		return state.currentFileList.map(fileInfo => new AfsFileRow({
			did: props.did,
			fileInfo,
			fileRowClicked: this.fileRowClicked.bind(this),
			parentDirectory: state.parentDirectory,
			rowType: events.DOWNLOADED,
			renderView: props.renderView
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
		const { children, state } = this
		const fileRows = this.makeFileRows()
		const backButton = this.makeBackButton()
		return html`
			<div>
				<div class="${styles.headerHolder} afsFileTable-headerHolder">
					<div class="${styles.nameHeader} afsFileTable-nameHeader">
						Name
						${children.sortFileButton.render({ children: state.sortNameReversed ? 'upArrow' : 'downArrow' })}
					</div>
					<div class="${styles.typeHeader} afsFileTable-typeHeader">
						Type
						${children.sortTypeButton.render({ children: state.sortTypeReversed ? 'upArrow' : 'downArrow' })}
					</div>
					<div class="${styles.sizeHeader} afsFileTable-sizeHeader">
						Size
						${children.sortSizeButton.render({ children: state.sortSizeReversed ? 'upArrow' : 'downArrow' })}
					</div>
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
