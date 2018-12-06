'use strict'

const Input = require('../components/input')
const styles = require('./styles/errorInput')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class ErrorInput extends Nanocomponent {
	constructor({
		field,
		errorMessage,
		parentState,
		placeholder,
	}) {
		super()
		this.state = { displayError: false }
		this.props = {
			field,
			parentState,
			errorMessage
		}
		this.children = {
			input: new Input({
				field,
				parentState,
				placeholder
			})
		}
	}

	update(){
		return true
	}

	createElement() {
		const { children, props, state } = this
		return html`
			<div class="${styles.container} ErrorInput-container">
				${children.input.render({ requiredIndicator: state.displayError })}
				<div class="${styles.errorMsg} ErrorInput-errorMsg">
					${state.displayError ? props.errorMessage : ""}
				</div>
			</div>
		`
	}
}

module.exports = ErrorInput