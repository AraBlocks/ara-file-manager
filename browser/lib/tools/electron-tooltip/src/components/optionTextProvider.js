'use strict'

const styles = require('./styles')
const html = require('choo/html')

module.exports = ({ optionType, cssClass }) => {
	let tooltipText
	switch (optionType) {
		case 'priceManagement':
			tooltipText = html`
				<div class=${styles[cssClass]}>
					<div>
						Ara Token value can fluctuate over time. To ensure the<br>
						cost of your file remains consistent with current market<br>
						valuation, File Manager can check and update your file’s<br>
						price every hour for a minimal network fee.<br><br>
						<b>You will need to leave File Manager running to utilize <br>this service.</b>
					</div>
				</div>
			`
			break
		default:
			break
	}
	return tooltipText
}