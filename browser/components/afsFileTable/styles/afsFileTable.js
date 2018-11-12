'use strict'

const { colors, fonts } = require('styleUtils')
const { css } = require('css')

module.exports = {
	colors,
	fonts,

	container: css`
		:host {
			font-family: ${fonts.regular};
			text-align: left;
			width: 100%;
			border-collapse: collapse;
		}

		:host th {
			border: 1px solid var(--ara-grey);
			height: 30px;
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
			height: 460px;
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

	headerHolder: css`
		:host {
			display: flex;
			background-color: white;
			border: 1px solid var(--ara-grey);
			position: sticky;
			top: 0;
		}

		:host div {
			height: 2em;
			padding-left: 5px;
			display: flex;
			align-items: center;
		}
	`,

	nameHeader: css`
		:host {
			align-items: center;
			border-right: 1px solid var(--ara-grey);
			display: flex;
			justify-content: space-between;
			padding-right: 5px;
			width: 60%;
		}
	`,

	sizeHeader: css`
		:host {
			width: 20%;
		}
	`,

	textHolder: css`
		:host {
			width: 100%;
		}
	`,

	typeHeader: css`
		:host {
			border-right: 1px solid var(--ara-grey);
			width: 17%;
		}
	`
}