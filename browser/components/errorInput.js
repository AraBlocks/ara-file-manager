const html = require('nanohtml')
const Nanocomponent = require('nanocomponent')

const Input = require('../components/input')
const styles = require('./styles/errorInput')

class ErrorInput extends Nanocomponent {
	constructor(opts) {
		super()
		this.state = {
			displayError: false,
			errorMessage: opts.errorMessage
		}
		this.props = {
			disabled: false,
			field: opts.field,
			parentState: opts.parentState
		}
		this.children = { input: new Input(opts) }
	}

	update(newProps){
		Object.assign(this.props, newProps)
		return true
	}

	createElement() {
		const { children, props, state } = this
		return (html`
			<div class="${styles.container} ErrorInput-container">
				${children.input.render({
					disabled: props.disabled,
					requiredIndicator: state.displayError
				})}
				<div class="${styles.errorMsg} ErrorInput-errorMsg">
					${state.displayError ? state.errorMessage : ""}
				</div>
			</div>
		`)
	}
}

module.exports = ErrorInput