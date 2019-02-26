const html = require('nanohtml')
const Nanocomponent = require('nanocomponent')

const Input = require('../components/input')
const styles = require('./styles/errorInput')

class ErrorInput extends Nanocomponent {
	constructor(opts) {
		super()
		this.props = {
			displayError: false,
			disabled: false,
			errorMessage: opts.errorMessage,
			field: opts.field,
		}
		this.children = { input: new Input(opts) }
	}

	update(newProps){
		Object.assign(this.props, newProps)
		return true
	}

	createElement() {
		const { children, props } = this
		return (html`
			<div class="${styles.container} ErrorInput-container">
				${children.input.render({
					disabled: props.disabled,
					requiredIndicator: props.displayError
				})}
				<div class="${styles.errorMsg} ErrorInput-errorMsg">
					${props.displayError ? props.errorMessage : ""}
				</div>
			</div>
		`)
	}
}

module.exports = ErrorInput