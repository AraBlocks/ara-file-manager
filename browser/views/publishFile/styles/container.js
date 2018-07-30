'use strict'

const {
	colors,
	fonts,
	fontCSS,
	overlay
} = require('styleUtils')
const { css } = require('css')

module.exports = {
	colors,
	content: fontCSS.proxiContent,
	fonts,
	overlay,
	title: fontCSS.noeH1,

	container: css`
		:host {
			display: flex;
			flex-direction: column;
			height: 450px;
			justify-content: space-between;
			margin: 20px;
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
		}
	`
}