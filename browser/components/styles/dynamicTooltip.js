'use strict'

const { colors, colorSelector, fonts } = require('styleUtils')
const { css } = require('css')

module.exports = {
	colors,
	fonts,

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
			border-radius: 7px;
			cursor: pointer;
			padding: 1px;
			position: relative;
			display: inline-block;
		}

		:host:hover {
			background-color: #d0d0d0;
		}

		:host .tooltipText {
			font-family: ${fonts.regular};
			font-size: 12px;
			visibility: hidden;
			width: 120px;
			bottom: 130%;
			left: 50%;
			margin-left: -60px;
			background-color: black;
			color: #fff;
			text-align: center;
			transition: opacity 1s;
			border-radius: 6px;
			padding: 5px 0;
			position: absolute;
			z-index: 1;
		}

		:host:hover .tooltipText{
			visibility: visible;
			opacity: 1;
		}

		:host .tooltipText:after {
			content: " ";
			position: absolute;
			top: 100%;
			left: 50%;
			margin-left: -5px;
			border-width: 5px;
			border-style: solid;
			border-color: black transparent transparent transparent;
		}
	`,
}