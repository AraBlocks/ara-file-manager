const html = require('nanohtml')
const Nanocomponent = require('nanocomponent')

const styles = require('./styles/checkbox')

class Checkbox extends Nanocomponent {
	constructor({
		checked = false,
		cssClass = { opts: {} },
		disabled = false,
		onCheck = () => {}
	} = {}) {
		super()
		this.props = {
			checked,
			cssClass,
			disabled,
			onCheck
		}
	}

	update(newProps = {}) {
		Object.assign(this.props, newProps)
		return true
	}

	createElement() {
		const { props } = this
		return (html`
			<div
				class="${styles.container({ ...props, ...props.cssClass })} checkbox-container"
				onclick=${props.disabled ? () => {} : props.onCheck}
			>
				${props.checked ? '✓' : null}
			</div>
		`)
	}
}
module.exports = Checkbox