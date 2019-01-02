'use strict'

const { colors, colorSelector, fonts } = require('styleUtils')
const { css } = require('css')

module.exports = {
	colors,
	fonts,

	container: css`
		:host {
			border-radius: 7px;
			cursor: pointer;
			transition: all ease-in-out;
		}
	`,

	clickableText({
		color = 'teal',
		fontSize = 14,
		fontFamily = fonts.bold
	}) {
		return css`
			:host {
				color: ${colorSelector(color)};
				font-family: ${fontFamily};
				font-size: ${fontSize}px;
			}
		`
	},

	tooltip: css`
		:host {
			position: relative;
			display: inline-block;
			border-bottom: 1px dotted black;
		}

		:host .tooltipText {
			visibility: hidden;
			width: 110px;
			bottom: 100%;
			left: 50%;
			margin-left: -60px;
			background-color: black;
			color: #fff;
			text-align: center;
			border-radius: 6px;
			padding: 5px 0;

			/* Position the tooltip */
			position: absolute;
			z-index: 1;
		}

		:host:hover .tooltipText{
			visibility: visible;
			opacity: 1;
		}
	`,
}