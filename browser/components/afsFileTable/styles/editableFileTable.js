'use strict'

const { colors, fonts } = require('styleUtils')
const { css } = require('css')

module.exports = {
	colors,
	fonts,

	container: css`
		:host {
			height: 325px;
			overflow: scroll;
			width: 100%;
		}
	`,

	dragDropMsg: css`
		:host {
			align-items: center;
			display: flex;
			color: var(--ara-grey);
			flex-direction: column;
			font-family: "NoeDisplay-Bold", "ProximaNova-Bold";
			font-size: 24px;
			height: 50%;
			justify-content: flex-end;
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
			height: 30px;
			padding-left: 20px;
			padding-right: 5px;
		}

		:host td {
			padding-left: 20px;
		}

		:host tr {
			display: block;
			height: 2em;
			cursor: default;
		}

		:host .item:hover {
			box-shadow: inset 0 0 4px 1px #7fc0ee;
		}

		:host tbody {
			display: block;
			overflow: auto;
		}

		:host thead {
			display: block;
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
	`,

	headerHolder: css`
		:host {
			align-items: center;
			display: flex;
			justify-content:
			space-between;
			width: 100%;
		}
	`
}