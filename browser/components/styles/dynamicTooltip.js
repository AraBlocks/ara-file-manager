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
			display: inline-block;
			position: relative;
		}

		:host:hover {
			background-color: #d0d0d0;
		}

		:host .tooltipText {
			bottom: 135%;
			background-color: black;
			border-radius: 6px;
			color: #fff;
			font-family: ${fonts.regular};
			font-size: 12px;
			left: 50%;
			margin-left: -60px;
			position: absolute;
			padding: 5px 0;
			visibility: hidden;
			transform: scale(0.9);
			transition: transform 0.2s ease-in-out;
			text-align: center;
			width: 120px;
			z-index: 1;
		}

		:host:hover .tooltipText{
			visibility: visible;
			transform: scale(1);
		}

		:host .tooltipText:after {
			content: " ";
			border-width: 5px;
			border-style: solid;
			border-color: black transparent transparent transparent;
			left: 50%;
			margin-left: -5px;
			position: absolute;
			top: 100%;
		}
	`,
}