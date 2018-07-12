'use strict'

const { colors, fonts, fontCSS } = require('styleUtils')
const { css } = require('css')

module.exports = {
	colors,
	fonts,
	fontCSS,
	ara: fontCSS.proxiH1,
	araOwned: fontCSS.proxiLarge,
	exchangeRate: fontCSS.proxiContent,

	container: css`
		:host {
      align-items: left;
      display: flex;
      flex-direction: column;
      height: 75px;
      justify-content: space-between;
			width: 100%;
		}
		:host b {
			font-family: ${fonts.bold};
		}
	`,

	priceContainer: css`
		:host {
			align-items: baseline;
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			width: 100%;
		}
	`
}