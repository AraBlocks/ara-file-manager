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
		this.children = opts.children
	}

	update(){
		return true
	}

	createElement() {
		const { eventMouseEnter, props, children} = this
		return html`
			<div class=${styles.tooltip}>
				${children}
				<span class="tooltipText">hi</span>
			</div>
		`
	}
}

module.exports = DynamicTooltip