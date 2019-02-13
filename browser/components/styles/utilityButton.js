const { colors, fonts } = require('styleUtils')
const { css } = require('css')

module.exports = {
	colors,
	fonts,

	standard: css`
		:host {
			cursor: pointer;
			height: 10px;
			width: 10px;
			font-size: 12px;
			-webkit-app-region: no-drag;
		}
	`,

	iconHolder(yTransform) {
		return css`
			:host {
        transform: scaleY(${yTransform});
				width: 100%;
			}
		`
	}
}