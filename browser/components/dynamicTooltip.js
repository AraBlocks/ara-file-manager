const styles = require('./styles/dynamicTooltip')
const html = require('nanohtml')
const Nanocomponent = require('nanocomponent')

class DynamicTooltip extends Nanocomponent {
	constructor({
		afterTooltipText = 'Copied!',
		beforeTooltipText = 'Copy to Clipboard',
		children,
		cssClass = {},
		itemClicked = () => {}
	} = {}) {
		super()
		this.props = {
			afterTooltipText,
			beforeTooltipText,
			cssClass,
			itemClicked
		}
		this.state = { clicked: false }
		this.children = children
	}

	update(){
		return true
	}

	createElement() {
		const { props, children, state} = this
		return (html`
			<div class=${styles.tooltip}
				onclick="${() => {
					props.itemClicked()
					state.clicked = true
					this.render()
				}}"
				onmouseleave="${() => {
					state.clicked = false
					this.render()
				}}"
			>
				<div class="${styles.clickableText(props.cssClass)} dynamicTooltip-clickableText">
					${children}
				</div>
				<div class="tooltipText">
					${state.clicked ? props.afterTooltipText : props.beforeTooltipText}
				</div>
			</div>
		`)
	}
}

module.exports = DynamicTooltip