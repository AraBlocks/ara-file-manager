'use strict'

const { colors, fonts } = require('styleUtils')
const { css } = require('css')

module.exports = {
	colors,
	fonts,

	standard: css`
		:host {
			background-color: white;
		}
	`,
}