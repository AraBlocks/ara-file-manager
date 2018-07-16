'use strict'

const { colors, fonts, fontCSS } = require('styleUtils')
const { css } = require('css')

module.exports = {
	colors,
	fonts,
	tooltipText: fontCSS.proxiContent,
	description: fontCSS.proxiContent,

	container: css`
		:host {
			display: flex;
		}
	`,

	textContainer: css`
		:host {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			padding-left: 10px;
		}
	`,

	topContainer: css`
		:host {
			display: flex;
		}
	`,

	title: css`
		:host {
			font-size: 12px;
			font-family: ${fonts.bold};
			padding-right: 5px;
		}
	`,

	tooltip: css`
	  :host {
			display: flex;
			flex-direction: column;
			height: 110px;
			justify-content: center;
			padding-left: 5px;
			text-align: left;
			width: 300px;
		}
		
		:host b {
			font-family: ${fonts.bold};
		}
	`
}