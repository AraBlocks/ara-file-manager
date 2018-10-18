'use strict'

const { colors, fonts } = require('styleUtils')
const { css } = require('css')

module.exports = {
	colors,
	fonts,

	container: css`
		:host {
			background-color: red;
			width: 200px;
			height: 200px;
		}

		:host:highlight {
			background-color: grey;
		}
	`,
}