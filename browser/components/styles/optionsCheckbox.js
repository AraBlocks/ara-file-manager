const { colors, fonts, fontCSS } = require('css-constants')
const { css } = require('css')

module.exports = {
	colors,
	fonts,
	description: fontCSS.proxiContent,

	container: css`
		:host {
			display: flex;
		}
	`,

	textContainer: css`
		:host {
			display: flex;
			flex-direction: column;
			justify-content: center;
			padding-left: 10px;
		}
	`,

	topContainer: css`
		:host {
			display: flex;
			padding-bottom: 2px;
		}
	`,

	title: css`
		:host {
			font-size: 12px;
			font-family: ${fonts.bold};
			padding-right: 5px;
		}
	`
}