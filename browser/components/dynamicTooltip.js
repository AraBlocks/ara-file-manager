'use strict'

const styles = require('./styles/dynamicTooltip')
const html = require('nanohtml')
const Nanocomponent = require('nanocomponent')

class DynamicTooltip extends Nanocomponent {
	constructor(opts) {
		super()
		this.props = {
			beforeTooltipText: opts.beforeTooltipText || 'Copy to Clipboard',
			afterTooltipText: opts.afterTooltipText || 'Copied!',
			itemClicked: opts.onclick,
			cssClass: opts.cssClass || {}
		}
		this.state = { clicked: false }
		this.children = opts.children
	}

	update(){
		return true
	}

	createElement() {
		const { eventMouseEnter, props, children, state} = this
		return html`
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
				<div class=${styles.clickableText(props.cssClass)}>
					${children}
				</div>
				<span class="tooltipText">${state.clicked ? props.afterTooltipText : props.beforeTooltipText}</span>
			</div>
		`
	}
}

module.exports = DynamicTooltip