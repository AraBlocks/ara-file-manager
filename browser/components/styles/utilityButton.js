'use strict'

const { colors, fonts } = require('styleUtils')
const { css } = require('css')

module.exports = {
	colors,
	fonts,

	standard: css`
		:host {
			cursor: pointer;
			height: 10px;
			width: 10px;
			font-size: 12px;
		}
	`,

	iconHolder: css`
		:host {
			width: 100%;
		}
	`
}