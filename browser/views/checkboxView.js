'use strict'

const Checkbox = require('../components/checkbox')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class CheckboxView extends Nanocomponent {
	constructor() {
		super()
		this.state = { checkbox: false }
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
	}

	update() {
		return true	
	}

	createElement() {
		const { checkbox, props } = this
		return html`
			<div>
				${checkbox.render()}
			</div>
		`
	}
}

module.exports = CheckboxView