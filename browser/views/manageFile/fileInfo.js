'use strict'

const FileSelector = require('../../components/fileSelector')
const helper = require('../../lib/store/clipboardHelper')
const Input = require('../../components/input')
const styles = require('./styles/fileInfo')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class FileInfo extends Nanocomponent {
	constructor({
		tokenPrice,
		parentState
	}) {
		super()

		this.props = { parentState }
		this.state = { tokenPrice }
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

	update({ tokenPrice }) {
		const { state } = this
		const sameState = state.tokenPrice === tokenPrice
		if (!sameState) {
			state.tokenPrice = tokenPrice
		}
		return !sameState
	}

	createElement() {
		const { children, state } = this
		return html`
			<div class=${styles.container}>
				<div class=${styles.verticalContainer}>
					<div class=${styles.infoTipHolder}>
						${children.fileNameInput.render()}
					</div>
					<div class=${styles.infoTipHolder}>
						${children.priceInput.render()}
						<b>ARA Token Price: ${state.tokenPrice}</b>
					</div>
				</div>
				<b>Update File</b>
				${children.fileSelector.render()}
				<b>Distribution Link</b>
				${children.distributionLink.render()}
			</div>
		`
	}
}

module.exports = FileInfo