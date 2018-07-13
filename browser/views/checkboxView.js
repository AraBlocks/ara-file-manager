'use strict'

const Checkbox = require('../components/checkbox')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class CheckboxView extends Nanocomponent {
	constructor() {
		super()
		this.props = {}
		this.checkbox = new Checkbox({ 
			checked: false, 
			cssClass: {
				opts: {
					colorChecked: 'blue'
				}
			}
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