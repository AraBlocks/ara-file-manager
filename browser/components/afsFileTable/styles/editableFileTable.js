'use strict'

const { colorSelector, fonts } = require('styleUtils')
const { css } = require('css')

module.exports = {
	fonts,

	addOptions: css`
		:host {
			bottom: 0;
			padding: 5px 0 0 20px;
			width: 100%;
		}
	`,

	add(visible = true) {
		return css`
			:host {
				display: ${visible ? 'inline' : 'none'};
				color: ${colorSelector('teal')};
				cursor: pointer;
				font-family: ${fonts.bold};
				font-size: 14px;
				-webkit-app-region: no-drag;
			}

			:host:hover {
				color: ${colorSelector('teal', true)};
			}
		`
	},

	container: css`
		:host {
			overflow: scroll;
			height: 340px;
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
			-webkit-app-region: no-drag;
		}

		:host th {
			border: 1px solid var(--ara-grey);
			height: 30px;
			padding-left: 12px;
			padding-right: 12px;
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
			background-color: #f0f8ff;
		}

		:host tbody {
			display: block;
			overflow: auto;
		}

		:host thead {
			display: block;
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