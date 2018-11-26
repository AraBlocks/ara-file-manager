'use strict'

const { colors, fonts } = require('styleUtils')
const { css } = require('css')

module.exports = {
	colors,
	fonts,

	addOptions: css`
		:host {
			background-color: white;
			bottom: 0;

			padding: 5px 0 0 20px;
			position: absolute;
			width: 100%;
		}
	`,

	add: css`
		:host {
			color: var(--ara-teal);
			cursor: pointer;
			font-family: ${fonts.bold};
			font-size: 14px;
		}
	`,

	container: css`
		:host {
			height: 325px;
			overflow: scroll;
			position: relative;
			width: 100%;
		}
	`,

	dragDropMsg: css`
		:host {
			align-items: center;
			display: flex;
			color: var(--ara-grey);
			flex-direction: column;
			font-family: ${fonts.black};
			font-size: 24px;
			height: 50%;
			justify-content: flex-end;
		}

		:host > div {
			font-family: ${fonts.bold};
			font-size: 14px;
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
			background-color: var(--ara-grey);
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