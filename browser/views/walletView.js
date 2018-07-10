'use strict'

const styles = require('./styles/walletView')
const styleUtils = require('styleUtils')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class WalletView extends Nanocomponent {
	constructor() {
		super()
		this.props = {}
}

	update(){
		return true
}

	createElement() {
		const { props } = this
		return html`
		
		<div class="${styles.container} WalletView-container">
			<div class="${styles.priceContainer} WalletView-priceContainer">
				<div class=${styleUtils.fontCSS.proxiLarge}>9999.99</div>
				<div class=${styleUtils.fontCSS.proxiH1}>ARA</div>
			</div>
			<div class=${styleUtils.fontCSS.proxiContent}>
				<b>Current Exchange Value</b>: 1.0 ARA = $1.73 USD
			</div>
    </div>
		`
	}
}

module.exports = WalletView
/* <div>
	<div class=${styleUtils.fontCSS.noeH1}>Hello</div>
	<div class=${styleUtils.fontCSS.proxiH1}>Hello</div>
	<div class=${styleUtils.fontCSS.proxiLarge}>Hello</div>
	<div class=${styleUtils.fontCSS.proxiContent}>Hello</div>
</div> */