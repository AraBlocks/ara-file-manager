'use strict'

const { colors, fonts } = require('styleUtils')
const { css } = require('css')

module.exports = {
	colors,
	fonts,

	fileNameCell: css`
		:host {
			display: flex;
			align-items: center;
			height: 2em;
			justify-content: left;
			padding-left: 20px;
		}
	`,

	fileImage: css`
		:host {
			width:22px;
			height:22px;
			padding-right: 10px;
		}
	`,

	fileRow: css`
		:host :hover > div {
			display: flex;
		}
	`,

	divider: css`
		:host {
			background-color: ${colors.araGrey};
			height: 1px;
			width: 100%;
		}
	`,

	menu: css`
		:host {
			align-items: center;
			background-color: white;
			border: 1px ${colors.araGrey} solid;
			border-bottom: 0px;
			box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
			display: none;
			font-size: 12px;
			flex-direction: column;
			justify-content: space-between;
			min-width: 90px;
			position: absolute;
			text-align: center;
			z-index: 1;
		}
	`,
}