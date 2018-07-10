'use strict'

const { colors, fonts } = require('styleUtils')
const { css } = require('../../../lib/cssTool/css')

module.exports = {
  colors,
  fonts,
	
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
			height: 25px;
			justify-content: space-around;
		}
	`,

  menu: css`
    :host {
			align-items: space-between;
			background-color: white;
			border: 1px ${colors.araGrey} solid;
			border-bottom: 0px;
			box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
			flex-direction: column;
			justify-content: space-between;
			position: absolute;
			width: 115px;
			z-index: 1;
    }
	`,
	
	menuBar: css`
		:host {
			background-color: black;
			height: 3px;
			width: 20px;
		}
	`
}