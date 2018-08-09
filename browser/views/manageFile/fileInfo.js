'use strict'

const FileSelector = require('../../components/fileSelector')
const helper = require('../../lib/store/clipboardHelper')
const Input = require('../../components/input')
const styles = require('./styles/fileInfo')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class FileInfo extends Nanocomponent {
	constructor({
		parentState
	}) {
		super()

		this.props = { parentState }
		this.children = {
			fileNameInput: new Input({
				field: 'fileName',
				placeholder: 'File Name',
				parentState
			}),
			priceInput: new Input({
				field: 'price',
				parentState,
				placeholder: 'Price',
				type: 'number',
				embeddedButton: {
					option: 'selection',
					optionList: [
						'ARA',
						'USD'
					],
					field: 'currency'
				}
			}),
			fileSelector: new FileSelector({
				field: 'filePath',
				parentState
			}),
			distributionLink: new Input({
				placeholder: 'Distribution Link',
				field: 'distributionLink',
				parentState,
				readOnly: true,
				embeddedButton: {
					option: 'button',
					children: 'Copy',
					onclick: this.copyLink.bind(this)
				}
			})
		}
	}

	copyLink() {
		const { children } = this
		helper.copyToClipboard(children.distributionLink.state.value, 'distributionLink')
	}

	update() {
		return true
	}

	createElement() {
		const { children, props } = this
		return html`
			<div class=${styles.container}>
				<div class=${styles.verticalContainer}>
					<div class=${styles.infoTipHolder}>
						${children.fileNameInput.render()}
					</div>
					<div class=${styles.infoTipHolder}>
						${children.priceInput.render()}
						<div class=${styles.araPriceHolder}>
							<b>ARA Token Price:</b>
							<div class=${styles.araPrice}>
								<b>${props.parentState['tokenPrice']} ARA</b>
							</div>
						</div>
					</div>
				</div>
				<b>Update File</b>
				${children.fileSelector.render()}
				<div class=${styles.distributionLink}>
					<b>Distribution Link</b>
				</div>
				${children.distributionLink.render()}
			</div>
		`
	}
}

module.exports = FileInfo