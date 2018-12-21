'use strict'

const styles = require('./styles/dynamicTooltip')
const html = require('nanohtml')
const Nanocomponent = require('nanocomponent')
const tt = require('electron-tooltip')

tt({
  position: 'top',
  style: { width: '130px' }
})

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
		this.eventMouseLeave = document.createEvent('MouseEvents')
    this.eventMouseEnter = document.createEvent('MouseEvents')
    this.eventMouseLeave.initMouseEvent('mouseleave', true, true)
    this.eventMouseEnter.initMouseEvent('mouseenter', true, true)
	}

	update(){
		return true
	}

	createElement() {
		const { eventMouseEnter, props } = this
		return html`
			<div
				data-tooltip="${props.beforeTooltipText}"
				class="${styles.container} dynamicTooltip-copyableText"
				onclick="${({ target }) => {
					target.parentElement.dataset.tooltip = props.afterTooltipText
					target.parentElement.dispatchEvent(eventMouseEnter)
					target.parentElement.dataset.tooltip = props.beforeTooltipText
					props.itemClicked()
				}}"
				onmouseenter="${({ target }) => target.style.backgroundColor = '#d0d0d0'}"
				onmouseleave="${({ target }) => target.style.backgroundColor = ''}"
			>
				<div class=${styles.clickableText(props.cssClass)}>
					${this.children}
				</div>
			</div>
		`
	}
}

module.exports = DynamicTooltip