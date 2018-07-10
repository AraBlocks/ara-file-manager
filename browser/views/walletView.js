'use strict'

const styles = require('./styles/walletView')
const styleUtils = require('styleUtils')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class WalletView extends Nanocomponent {
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

	update(){
		return true
	}

	createElement() {
		const { state } = this
		return html`		
			<div class="${styles.container} WalletView-container">
				<div class="${styles.priceContainer} WalletView-priceContainer">
					<div class="${styleUtils.fontCSS.proxiLarge} StylesUtil-proxiLarge">${state.araOwned}</div>
					<div class="${styleUtils.fontCSS.proxiH1} StylesUtil-proxiH1">ARA</div>
				</div>
				<div class="${styleUtils.fontCSS.proxiContent} StylesUtil-proxiContent">
					<b>Current Exchange Value</b>: 1.0 ARA = $ ${state.exchangeRate} USD
				</div>
			</div>
		`
	}
}

module.exports = WalletView
