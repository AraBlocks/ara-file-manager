'use strict'

const FileSelector = require('../../components/fileSelector')
const FileTable = require('../../components/afsFileTable/editableFileTable')
const Input = require('../../components/input')
const k = require('../../../lib/constants/stateManagement')
const styles = require('./styles/fileInfo')
const deeplink = require('../../lib/tools/deeplink')
const html = require('choo/html')
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
			distributionLink: new Input({
				placeholder: 'Distribution Link',
				field: 'distributionLink',
				parentState,
				readOnly: true,
				embeddedButton: {
					option: 'button',
					children: 'Copy',
					onclick: () => deeplink.copyDeeplink(parentState.did, parentState.name)
				}
			}),
			fileTable: new FileTable({
				addItems,
				did,
				parentState,
				field: 'fileList',
				tableType: k.UPDATE_FILE,
				renderView
			}),
			fileNameInput: new Input({
				field: 'name',
				placeholder: 'File Name',
				parentState
			}),
			fileSelector: new FileSelector({
				field: 'filePath',
				parentState
			}),
			priceInput: new Input({
				araIcon: true,
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
			<div class=${styles.container}>
				<div class=${styles.verticalContainer}>
					<div class=${styles.infoTipHolder}>
						${children.fileNameInput.render({ value: parentState.name })}
					</div>
					<div class=${styles.infoTipHolder}>
						${children.priceInput.render({ value: parentState.price, requiredIndicator: parentState.price < 0 })}
						<div class=${styles.araPriceHolder}>
							<b>Ara Token Price:</b>
							<div class=${styles.araPrice}>
								<b>${parentState.tokenPrice} Ara</b>
							</div>
						</div>
						<div class="${styles.errorMsg} FileInfo-errorMsg">
							${parentState.price < 0 ? "Price Cannot be negative" : ""}
						</div>
					</div>
				</div>
				<div class=${styles.distributionLink}>
					<b>Distribution Link</b>
				</div>
				${children.distributionLink.render({ value: deeplink.getDeeplink(parentState.did, parentState.name) })}
				<div class="${styles.fileTable} manageFile-fileTable">
					${children.fileTable.render()}
				</div>
			</div>
		`
	}
}

module.exports = FileInfo