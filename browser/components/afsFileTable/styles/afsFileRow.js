'use strict'

const { colors, fonts } = require('styleUtils')
const { css } = require('css')

module.exports = {
	colors,
	fonts,

	contextMenu: css`
		:host {
			width: 0;
			height: 0;
			display: none;
			position: absolute;
			border: 1px solid var(--ara-grey);
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
			cursor: pointer;
			font-family: ${fonts.light};
			height: 2em;
			line-height: 2em;
			padding: 0 5px;
      text-align: center;
      text-overflow: ellipsis;
      vertical-align: middle;
			width: 100px;
		}

		:host:hover {
			background-color: #c9c9c9;
    }
	`
}