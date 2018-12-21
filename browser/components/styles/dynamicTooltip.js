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
			padding: 2px 4px;
			-webkit-app-region: no-drag;
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
	}
}