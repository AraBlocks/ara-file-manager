'use strict'

const { colors, fonts } = require('styleUtils')
const { css } = require('../../../lib/cssTool/css')

module.exports = {
  colors,
	fonts,

	container: css`
		:host {
			cursor: pointer;
			height: 100%;
			font-size: 12px;
			position: relative;
		}

		:host:hover > div {
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

	hamburger: css`
		:host {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			height: 100%;
		}
	`,

  menu: css`
    :host {
			align-items: space-between;
			background-color: white;
			border: 1px ${colors.araGrey} solid;
			border-bottom: 0px;
			box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
			display: none;
			flex-direction: column;
			justify-content: space-between;
			min-width: 130px;
			position: absolute;
			z-index: 1;
    }
	`,

	menuBar: css`
		:host {
			background-color: black;
			height: 25%;
		}
	`
}