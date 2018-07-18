'use strict'

const FileSlector = require('../../components/fileSelector')
const Input = require('../../components/input')
const styles = require('./styles/fileInfo')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class FileInfo extends Nanocomponent {
	constructor() {
		super()
		this.state = {
			currency: '',
			fileName: '',
			filePath: '',
			price: ''
		}
		this.children = {
			fileNameInput: new Input({
				field: 'fileName',
				placeholder: 'File Name',
				parentState: this.state
			}),
			priceInput: new Input({
				field: 'price',
				parentState: this.state,
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
			fileSelector: new FileSlector({
				field: 'filePath',
				parentState: this.state
			})
		}
	}

	update(){
		return true
	}

	createElement() {
		const { children } = this
		return html`
			<div class=${styles.container}>
				<div class=${styles.verticalContainer}>
					<div class=${styles.infoTipHolder}>
						${children.fileNameInput.render()}
						<div class=${styles.infoTip}>
							<div>
								<b>Recommended:</b> If this field is left blank, users will only<br>
								see the file’s generic ARA id.
							</div>
						</div>
					</div>
					<div class=${styles.infoTipHolder}>
						${children.priceInput.render()}
						<div class=${styles.infoTip}>
							Price is converted to the equivalent value in ARA Tokens.<br>
							Leave blank if you do not want to charge for this file.
						</div>
					</div>
				</div>
				<div class=${styles.fileDirectoryHoler}>
					${children.fileSelector.render()}
				</div>
			</div>
		`
	}
}

module.exports = FileInfo