'use strict'

const styles = require('./styles')
const html = require('choo/html')

module.exports = ({ optionType, cssClass }) => {
	let tooltipText
	switch (optionType) {
		case 'supernode':
			tooltipText = html`
				<div class=${styles[cssClass]}>
					<div>
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
				</div>
			`
			break
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