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
    this.eventMouseLeave.initMouseEvent('mouseout', false, true)
    this.eventMouseEnter.initMouseEvent('mouseenter', false, true)
	}

	update(){
		return true
	}

	createElement() {
		const { eventMouseEnter, props } = this
		return html`
			<div
				data-tooltip="${props.beforeTooltipText}"
				class="${styles.container} ${styles.clickableText(props.cssClass)} dynamicTooltip-copyableText"
				onclick="${({ target }) => {
					target.dataset.tooltip = props.afterTooltipText
					target.dispatchEvent(eventMouseEnter)
					target.dataset.tooltip = props.beforeTooltipText
					props.itemClicked()
				}}"
				onmouseenter="${(e) => {
					console.log("on Mouse Enter")
					e.preventDefault()
					e.target.style.backgroundColor = '#d0d0d0'
				}}"
				onmouseout="${(e) => {
					console.log("on Mouse Leave")
					e.preventDefault()
					e.target.style.backgroundColor = ''
				}}"
			>
				${this.children}
			</div>
		`
	}
}

module.exports = DynamicTooltip