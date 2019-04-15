const html = require('nanohtml')
const Nanocomponent = require('nanocomponent')

const Input = require('../components/input')
const styles = require('./styles/errorInput')

class ErrorInput extends Nanocomponent {
	constructor({
		disabled = false,
		errorMessage = '',
		onchange = () => {},
		oninput = () => {},
		placeholder = '',
		type,
		value = ''
	} = {}) {
		super()
		this.props = { disabled, errorMessage, value }
		this.children = {
			input: new Input({
				disabled,
				onchange,
				oninput,
				placeholder,
				value,
				type
			})
		}
	}

	update(newProps = {}){
		Object.assign(this.props, newProps)
		return true
	}

	createElement() {
		const { children, props } = this
		const {
			disabled,
			errorMessage,
			value
		} = props
		return (html`
			<div class="${styles.container} ErrorInput-container">
				${children.input.render({
					disabled,
					requiredIndicator: Boolean(errorMessage),
					value
				})}
				<div class="${styles.errorMsg} ErrorInput-errorMsg">
					${errorMessage}
				</div>
			</div>
		`)
	}
}

module.exports = ErrorInput