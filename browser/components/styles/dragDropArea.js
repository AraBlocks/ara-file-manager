'use strict'

const { colors, fonts } = require('styleUtils')
const { css } = require('css')

module.exports = {
	colors,
	fonts,

	container: css`
		:host {
			border: 2px solid white;
			height: 100%;
			width: 100%;
		}
	`,

	selected: css`
		:host {
			border: 2px solid var(--ara-grey);
		}
	`
}