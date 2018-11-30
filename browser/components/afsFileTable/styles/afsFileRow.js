'use strict'

const { colors, fonts } = require('styleUtils')
const { css } = require('css')

module.exports = {
	colors,
	fonts,

	contextMenu: css`
		:host {
			height: 5px;
			display: none;
			background-color: red;
			position: absolute;
			width: 5px;
		}

		:host:before {
			content: "";
			position: absolute;
			left: -12px;
			top: -12px;
			height: 12px;
			width: 30px;
			z-index: 999;
		}

		:host:after {
			content: "";
			position: absolute;
			left: -12px;
			top: -12px;
			height: 30px;
			width: 12px;
			z-index: 999;
		}
	`,

	fileNameCell: css`
		:host {
			height: 2em;
			min-width: 350px;
			max-width: 350px;
			overflow: hidden;
    	text-overflow: ellipsis;
    	white-space: nowrap;
		}
	`,

	fileImage: css`
		:host {
			height:22px;
			padding-right: 10px;
			width:22px;
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

	menuItem: css`
		:host {
			background-color: white;
			border: 1px solid #e9e9e9;
			cursor: pointer;
			font-family: ${fonts.light};
			font-size: 13px;
			height: 2em;
			line-height: 2em;
			padding: 0 5px;
      text-align: center;
      text-overflow: ellipsis;
      vertical-align: middle;
			width: 100px;
			z-index: 1;
		}

		:host:hover {
			background-color: #eeeeee;
    }
	`
}