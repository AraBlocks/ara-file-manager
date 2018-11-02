'use strict'

const { colors, fonts } = require('styleUtils')
const { css } = require('css')

module.exports = {
	colors,
	fonts,

	container: css`
		:host {
			height: 100%;
			overflow: scroll;
			width: 100%;
		}
	`,
	fileTable: css`
		:host {
			border-collapse: collapse;
			font-family: ${fonts.regular};
			text-align: left;
			width: 100%;
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
			height: 30px;
			justify-content: space-around;
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