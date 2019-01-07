'use strict'

const FileSelector = require('../../components/fileSelector')
const FileTable = require('../../components/afsFileTable/editableFileTable')
const ErrorInput = require('../../components/errorInput')
const k = require('../../../lib/constants/stateManagement')
const styles = require('./styles/fileInfo')
const html = require('nanohtml')
const Nanocomponent = require('nanocomponent')

class FileInfo extends Nanocomponent {
	constructor(props) {
		const {
			addItems,
			did,
			parentState,
			renderView
		} = props

		super()

		this.props = { did, parentState, renderView }
		this.children = {
			fileTable: new FileTable({
				addItems,
				did,
				parentState,
				field: 'fileList',
				tableType: k.UPDATE_FILE,
				renderView
			}),
			fileNameInput: new ErrorInput({
				field: 'name',
				placeholder: 'File Name',
				parentState,
				renderView
			}),
			fileSelector: new FileSelector({
				field: 'filePath',
				parentState
			}),
			priceInput: new ErrorInput({
				araIcon: true,
				errorMessage: 'Price cannot be negative',
				field: 'price',
				parentState,
				placeholder: 'Price',
				type: 'number',
				renderView
			})
		}
	}

	update({ parentState }) {
		this.props = { parentState }
		return true
	}

	createElement() {
		const { children, props: { parentState } } = this
		return html`
			<div class="${styles.container} manageFile-fileInfo-container">
				<div class="${styles.verticalContainer}">
					<div class="${styles.infoTipHolder}">
						${children.fileNameInput.render({ value: parentState.name })}
						<div class="${styles.infoTip}">
							<div>
								<b>Recommended:</b> If this field is left blank, users will only
								see the package's generic Ara ID.
							</div>
						</div>
					</div>
					<div class="${styles.infoTipHolder}">
						${children.priceInput.render({ value: parentState.price, displayError: parentState.price < 0 })}
						<div class="${styles.infoTip}">
							Leave blank if you do not want to charge for this file.
						</div>
						<div class="${styles.araPriceHolder}">
							<b>Ara Token Price:</b>
							<div class="${styles.araPrice}">
								<b>${parentState.tokenPrice} Ara</b>
							</div>
						</div>
					</div>
				</div>
				<div class="${styles.fileTable} manageFile-fileTable">
					${children.fileTable.render()}
				</div>
			</div>
		`
	}
}

module.exports = FileInfo