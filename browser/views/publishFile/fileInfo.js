'use strict'

const FileSlector = require('../components/fileSelector')
const Input = require('../components/input')
const styles = require('./styles/fileInfo')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class FileInfo extends Nanocomponent {
	constructor() {
		super()
		this.props = {}
		this.state = {
			currency: '',
			fileName: '',
			filePath,
			price: ''
		}
		this.children = {
			fileNameInput: new Input({
				field: 'fileName',
				parentState: this.state
			}),
			priceInput: new Input({
				field: 'price',
				parentState: this.state
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
		const { children, props } = this
		return html`
			<div class=${styles.container}>
				<div class=${styles.verticalContainer}>
					<div class=${styles.infoTipHolder}>
						${children.fileNameInput.render()}
					</div>
				</div>
			</div>
		`
	}
}

module.exports = FileInfo