'use strict'

const FileSelector = require('../../components/fileSelector')
const Input = require('../../components/input')
const styles = require('./styles/fileInfo')
const windowManagement = require('../../lib/tools/windowManagement')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class FileInfo extends Nanocomponent {
	constructor({
		parentState
	}) {
		super()

		this.props = { parentState }
		this.children = {
			distributionLink: new Input({
				placeholder: 'Distribution Link',
				field: 'distributionLink',
				parentState,
				readOnly: true,
				embeddedButton: {
					option: 'button',
					children: 'Copy',
					onclick: () => {
						windowManagement.copyDistributionLink(parentState.fileAid, parentState.fileName)
					}
				}
			}),
			fileNameInput: new Input({
				field: 'fileName',
				placeholder: 'File Name',
				parentState
			}),
			fileSelector: new FileSelector({
				field: 'filePath',
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
						${children.fileNameInput.render({ value: parentState.fileName })}
					</div>
					<div class=${styles.infoTipHolder}>
						${children.priceInput.render({ value: parentState.price })}
						<div class=${styles.araPriceHolder}>
							<b>ARA Token Price:</b>
							<div class=${styles.araPrice}>
								<b>${parentState.tokenPrice} ARA</b>
							</div>
						</div>
					</div>
				</div>
				<b>Update File</b>
				${children.fileSelector.render({ filePath: parentState.filePath })}
				<div class=${styles.distributionLink}>
					<b>Distribution Link</b>
				</div>
				${children.distributionLink.render({ value: windowManagement.getDistributionLink(parentState.fileAid, parentState.fileName) })}
			</div>
		`
	}
}

module.exports = FileInfo