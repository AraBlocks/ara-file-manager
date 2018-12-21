'use strict'

const Input = require('../components/input')
const styles = require('./styles/errorInput')
const html = require('nanohtml')
const Nanocomponent = require('nanocomponent')

class ErrorInput extends Nanocomponent {
	constructor(opts) {
		super()
		this.state = {
			displayError: false,
			errorMessage: opts.errorMessage
		}
		this.props = {
			field: opts.field,
			parentState: opts.parentState,
		}
		this.children = {
			input: new Input(opts)
		}
	}

	update({ displayError, errorMessage }){
		const { state } = this
		state.displayError = displayError
		state.errorMessage = errorMessage || state.errorMessage
		return true
	}

	createElement() {
		const { children, state } = this
		return html`
			<div class="${styles.container} ErrorInput-container">
				${children.input.render({ requiredIndicator: state.displayError })}
				<div class="${styles.errorMsg} ErrorInput-errorMsg">
					${state.displayError ? state.errorMessage : ""}
				</div>
			</div>
		`
	}
}

module.exports = ErrorInput