'use strict'

const Checkbox = require('./checkbox')
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
				tooltipText: this.createTooltipText(),
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

	createTooltipText() {
		switch (this.props.optionType) {
			case 'supernode':
				return html`
					<div class="${styles.tooltip} ${styles.tooltipText}">
					<div>
						Uploading your file to the <b>Littlstar Supernode</b> ensures<br>
					</div>
					that it will always be available via high-quality<br>
					connections on the network.<br><br>
					<div>
						If you choose <b>not</b> to host your file on Littlstar, you'll need<br>
					</div>
					to host the file on your own computer and remain<br>
					connected in order to guarantee distribution.<br>
					</div>
				`
			case 'priceManagement':
				return html`
					<div class="${styles.tooltip} ${styles.tooltipText}">
						ARA Token value can fluctuate over time. To ensure the<br>
						cost of your file remains consistent with current market<br>
						valuation, File Manager can check and update your file’s<br>
						price every hour for a minimal network fee.<br><br>
						<b>You will need to leave File Manager running to utilize this service.</b>
					</div>
				`
			default:
				return
		}
	}

	createElement() {
		const { children, props } = this
		const { title, description } = getOptionsText()
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
		function getOptionsText() {
			let title
			let description
			switch (props.optionType) {
				case 'supernode':
					title = 'Host on Littlstar Supernode'
					description = '5.00 ARA per month'
				case 'priceManagement':
					title = 'Turn on Price Maintenance'
					description = 'Hourly fee based on current network costs (~0.01 - 0.05 ARA)'
				default:
					break
			}
			return { title, description }
		}
	}
}

module.exports = OptionsCheckbox