'use strict'

const styles = require('./styles/checkbox')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class Checkbox extends Nanocomponent {
	constructor({ 
		checked, 
		cssClass = {},
		field = "" ,
		parentState = {}
	}) {
		super()
		this.props = { cssClass, field, parentState }
		this.state = { checked }
		this.onclick = this.onclick.bind(this)
	}

	onclick() {
		this.state.checked = !this.state.checked
		this.props.parentState[this.props.field] = this.state.checked
		this.rerender()
	}

	update({ checked }) {
		const { state } = this
		const sameState = state.checked == checked
		if (!sameState) {
			state.checked = checked
		}
		return !sameState
	}

	createElement() {
		const { onclick, props, state } = this
		return html`
			<div 
				class=${styles.container({	
					checked: state.checked, 
					opts: props.cssClass.opts || {}
				})} 
				onclick=${onclick}
			>
				<div class=${styles.checkmark({
					checked: state.checked,
					opts: props.cssClass.opts || {}
				})}
				>
					✓
				</div>
			</div>
		`
	}
}

module.exports = Checkbox