'use strict'

const { colors, fonts } = require('styleUtils')
const { css } = require('css')

module.exports = {
	colors,
	fonts,

	container: css`
		:host {
			width: 100%;
			height: 100%;
			background-color: yellow;
		}
	`,
	fileTable: css`
		:host {
			font-family: ${fonts.regular};
			text-align: left;
			width: 100%;
			border-collapse: collapse;
			background-color: green;
		}

		:host th {
			border: 1px solid var(--ara-grey);
			padding-left: 20px;
		}

		:host td {
			padding-left: 20px;
		}

		:host tr {
			height: 2em;
		}
	`,

	backButton: css`
		:host {
			display: flex;
			flex-direction: column;
			justify-content: space-around;
			height: 30px;
		}
	`,

	divider: css`
		:host {
			background-color: ${colors.araGrey};
			height: 1px;
			width: 100%;
		}
	`,

	textHolder: css`
		:host {
			width: 100%;
		}
	`
}