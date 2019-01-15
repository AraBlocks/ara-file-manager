'use strict'

const { colors, fonts, fontCSS } = require('styleUtils')
const { css } = require('css')

module.exports = {
	colors,
	content: fontCSS.proxiContent,
	fonts,
	title: fontCSS.noeH1,

	container: css`
		:host {
			display: flex;
			flex-direction: column;
			height: 660px;
			justify-content: space-between;
			margin: 20px;
		}

		:host b {
			font-family: ${fonts.bold}
		}
	`,

	horizontalContainer: css`
		:host {
			display: flex;
			justify-content: space-between;
		}
	`,

	fileTable: css`
		:host {
			height: 420px;
			overflow: scroll;
		}
	`
}