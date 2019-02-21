const { colors, fonts } = require('css-constants')
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

	menu({ visible, direction = 'right' }) {
		return css`
			:host {
				top: 25%;
				display: ${visible ? 'flex' : 'none'};
				flex-direction: column;
				justify-content: space-between;
				min-width: 100px;
				position: absolute;
				${direction === 'right' ? 'left' : 'right'}: 0;
			}
		`
	},

	invisibleItem: css`
		:host {
			cursor: default;
			display: block;
			height: 15px;
			overflow: hidden;
			opacity: 0;
			-webkit-app-region: no-drag;
			z-index: 9999;
		}
	`
}