'use strict'

const Checkbox = require('../components/checkbox')
const FileSlector = require('../components/fileSelector')
const OptionsCheckbox = require('../components/optionsCheckbox')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class CheckboxView extends Nanocomponent {
	constructor() {
		super()
		this.state = { checkbox: false, supernode: false, filePath: '' }
		this.checkbox = new Checkbox({
			checked: false,
			cssClass: {
				opts: {
					colorChecked: 'blue'
				}
			},
			field: 'checkbox',
			parentState: this.state
		})

		this.optionsCheckbox = new OptionsCheckbox(
			{
				field: 'supernode',
				parentState: this.state
			}
		)

		this.fileSelector = new FileSlector({
			field: 'filePath',
			parentState: this.state
		})
	}

	update() {
		return true
	}

	createElement() {
		const { checkbox, optionsCheckbox, fileSelector, state } = this
		return html`
			<div>
				${checkbox.render()}
				${optionsCheckbox.render()}
				<button onclick=${onclick}>log all states</button>
				${fileSelector.render()}
			</div>
		`

		function onclick() {
			console.log(state)
		}
	}
}

module.exports = CheckboxView