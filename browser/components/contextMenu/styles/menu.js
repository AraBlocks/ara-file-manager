const { colors, fonts } = require('css-constants')
const { css } = require('css')

module.exports = {
	colors,
	fonts,

	container({ visible, left, top }) {
		return css`
			:host {
				align-items: center;
				cursor: pointer;
				display: ${visible ? 'flex' : 'none'};
				font-size: 12px;
				${left && 'left:' + left};
				position: absolute;
				${top && 'top:' + top};
			}
		`
	},

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

	menu({ direction = 'right', top, left }) {
		return css`
			:host {
				${direction === 'right' ? 'left' : 'right'}: 0;
				display: flex;
				justify-content: space-between;
				flex-direction: column;
				${left && 'left:' + left};
				min-width: 100px;
				${top && 'top:' + top};
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