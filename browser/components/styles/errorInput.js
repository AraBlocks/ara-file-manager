const { colors, fonts, colorSelector } = require('styleUtils')
const { css } = require('css')

module.exports = {
	colors,
	fonts,

	container: css`
		:host {
			display: flex;
			flex-direction: column;
			width: 100%;
			height: 62px;
			-webkit-app-region: no-drag;
		}
	`,

	errorMsg: css`
		:host {
			color: ${colorSelector('red')};
			font-size: 10px !important;
			padding-top: 3px;
			width: 100%;
		}
	`,
}