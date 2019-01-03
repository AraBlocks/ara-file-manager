'use strict'

const { colors, fonts } = require('styleUtils')
const { css } = require('../../../lib/cssTool/css')

module.exports = {
  colors,
	fonts,

	container: css`
		:host {
			cursor: pointer;
			display: flex;
			flex-direction: cloumn;
			align-items: center;
			width: 100%;
			height: 100%;
			font-size: 12px;
			position: relative;
			-webkit-app-region: no-drag;
		}
	`,

	divider: css`
		:host {
			background-color: ${colors.araGrey};
			height: 1px;
			width: 100%;
		}
	`,

	hamburger: css`
		:host {
			height: 8px;
			width: 50%;
		}
	`,

  menu(visible) {
		return css`
			:host {
				align-items: space-between;
				top: 10%;
				display: ${visible ? 'flex' : 'none'};
				flex-direction: column;
				justify-content: space-between;
				min-width: 130px;
				position: absolute;
				z-index: 999;
			}

			:host:before {
				content: " ";
				visible: false;
				height: 25px;
				width: 100%;
			}
		`
	},

	menuBar: css`
		:host {
			background-color: black;
			height: 25%;
		}
	`
}