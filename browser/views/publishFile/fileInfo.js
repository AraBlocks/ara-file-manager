'use strict'

const k = require('../../../lib/constants/stateManagement')
const FileTable = require('../../components/afsFileTable/editableFileTable')
const ErrorInput = require('../../components/errorInput')
const styles = require('./styles/fileInfo')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class FileInfo extends Nanocomponent {
	constructor({ addItems, parentState, renderView }) {
		super()

		this.props = { parentState, renderView }
		this.children = {
			fileNameInput: new ErrorInput({
				field: 'fileName',
				placeholder: 'File Name',
				parentState
			}),
			priceInput: new ErrorInput({
				errorMessage: 'Price cannot be negative',
				araIcon: true,
				field: 'price',
				parentState,
				placeholder: 'Price',
				type: 'number',
				renderView
			}),
			fileSelector: new FileTable({
				addItems,
				parentState,
				field: 'fileList',
				tableType: k.PUBLISH,
				renderView
			})
		}
	}

	update() {
		return true
	}

	createElement() {
		const { children, props } = this
		return html`
			<div class="${styles.container}">
				<div class="${styles.verticalContainer} publishFile-verticalContainer">
					<div class="${styles.infoTipHolder}">
						${children.fileNameInput.render({})}
						<div class="${styles.infoTip}">
							<div>
								<b>Recommended:</b> If this field is left blank, users will only
								see the package's generic Ara ID.
							</div>
						</div>
					</div>
					<div class="${styles.infoTipHolder}">
						${children.priceInput.render({ displayError: props.parentState.price < 0 })}
						<div class="${styles.infoTip}">
							Price is converted to the equivalent value in Ara Tokens.
							Leave blank if you do not want to charge for this file.
						</div>
					</div>
				</div>
				<div class="${styles.fileDirectoryHolder}">
					${children.fileSelector.render()}
				</div>
			</div>
		`
	}
}

module.exports = FileInfo