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
			background-color: red;
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
				top: 100%;
				background-color: white;
				border: 1px ${colors.araGrey} solid;
				border-bottom: 0px;
				box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
				display: ${visible ? 'flex' : 'none'};
				flex-direction: column;
				justify-content: space-between;
				min-width: 130px;
				position: absolute;
				z-index: 999;
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