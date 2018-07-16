'use strict'

const Checkbox = require('./checkbox')
const optionsTextProvider = require('../lib/store/optionsTextProvider')
const styles = require('./styles/optionsCheckbox')
const Tooltip = require('./tooltip')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class OptionsCheckbox extends Nanocomponent {
	constructor({
		optionType = '',
		parentState = {}
	}) {
		super()
		this.props = { optionType }
		this.children = {
			tooltip: new Tooltip({
				tooltipText: html`
					<div class="${styles.tooltip} ${styles.tooltipText}">
						${optionsTextProvider.createTooltipText(optionType)}
					</div>
				`,
				opts: {
					maxWidth: 300
				}
			}),
			checkbox: new Checkbox({
				field: optionType,
				parentState: parentState
			})
		}
	}

	update() {
		return true
	}

	createElement() {
		const { children, props } = this
		const { title, description } = optionsTextProvider.getOptionsTitleDescription(props.optionType)
		return html`
			<div class="${styles.container} OptionsCheckbox-container">
				${children.checkbox.render()}
				<div class="${styles.textContainer} OptionsCheckbox-textContainer">
					<div class="${styles.topContainer} OptionsCheckbox-topContainer">
						<div class="${styles.title} OptionsCheckbox-title">
							${title}
						</div>
							${children.tooltip.render()}
					</div>
					<div class="${styles.description} OptionsCheckbox-description">
						${description}
					</div>
				</div>
			</div>
		`
	}
}

module.exports = OptionsCheckbox