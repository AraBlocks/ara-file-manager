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
			justify-content: space-between;
			margin: 20px;
			height: 450px;
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

	titleHolder: css`
		:host {
			display: flex;
			justify-content: space-between;
		}
	`,

	optionsHolder: css`
		:host {
			display: flex;
			justify-content: space-between;
		}
	`
}