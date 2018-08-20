'use strict'

const styles = require('./styles/walletInfo')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class WalletInfo extends Nanocomponent {
	constructor({
		araOwned = 0,
		exchangeRate = 0
	}) {
		super()
		this.state = {
			araOwned,
			exchangeRate
		}
	}

	update({ araOwned, exchangeRate }){
		const { state } = this
		const sameState = state.araOwned === araOwned && state.exchangeRate == exchangeRate
		if (!sameState) {
			state.araOwned = araOwned
			state.exchangeRate = exchangeRate
		}
		return !sameState
	}

	createElement() {
		const { state } = this
		return html`
			<div class="${styles.container} WalletView-container">
				<div class="${styles.priceContainer} WalletView-priceContainer">
					<div class="${styles.araOwned} StylesUtil-proxiLarge">
						${state.araOwned}
					</div>
					<div class="${styles.ara} StylesUtil-proxiH1">
						ARA
					</div>
				</div>
				<div class="${styles.exchangeRate} StylesUtil-proxiContent">
					<b>Current Exchange Value</b>: 1.0 ARA = $ ${state.exchangeRate} USD
				</div>
			</div>
		`
	}
}

module.exports = WalletInfo
