'use strict'

const { colors, fonts, fontCSS } = require('styleUtils')
const { css } = require('css')

module.exports = {
	colors,
	fonts,
	title: fontCSS.noeH1,
	content: fontCSS.proxiContent,

	container: css`
		:host {
			display: flex;
			flex-direction: column;
			height: 710px;
			justify-content: space-between;
			margin: 20px;
			margin-top: 0;
		}

		:host b {
			font-family: ${fonts.bold}
		}
	`,

	divider: css`
		:host {
			background-color: ${colors.araGrey};
			height: 1px;
			width: 100%;
		}
	`,

	horizontalContainer: css`
		:host {
			display: flex;
			justify-content: space-between;
			margin-top: 20px;
		}
	`
}