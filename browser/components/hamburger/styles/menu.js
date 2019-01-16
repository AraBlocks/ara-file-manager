'use strict'

const { colors, fonts } = require('styleUtils')
const { css } = require('css')

module.exports = {
	colors,
	fonts,

	container: css`
		:host {
			cursor: pointer;
			display: flex;
			align-items: center;
			width: 100%;
			height: 100%;
			font-size: 12px;
			position: relative;
		}
	`,

	divider: css`
		:host {
			background-color: ${colors.araGrey};
			height: 1px;
			width: 100%;
			z-index: 9999;
		}
	`,

	hamburger: css`
		:host {
			height: 50%;
		}
	`,

	menu({ visible, direction = 'left' }) {
		return css`
			:host {
				top: 86%;
				display: ${visible ? 'flex' : 'none'};
				flex-direction: column;
				justify-content: space-between;
				min-width: 130px;
				position: absolute;
				${direction}: 0;
			}
		`
	}
}