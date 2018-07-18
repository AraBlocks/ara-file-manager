'use strict'

const { colors, fonts } = require('styleUtils')
const { css } = require('css')

module.exports = {
	colors,
	fonts,

	container: css`
		:host {
			display: flex;
			flex-direction: column;
		}
	`,

	infoTipHolder: css`
		:host {
			display: flex;
			flex-direction: column;
		}
	`,

	verticalContainer: css`
		:host {
			display: flex;
		}
	`
}