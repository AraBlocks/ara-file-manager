const { colors, fonts, fontCSS } = require('styleUtils')
const { css } = require('css')

module.exports = {
	colors,
	fonts,
	title: fontCSS.noeH1,
	content: fontCSS.proxiContent,

	container: css`
		:host {
			display: flex;
			flex-direction: column;
			height: 710px;
			justify-content: space-between;
			margin: 20px;
			margin-top: 0;
		}

		:host b {
			font-family: ${fonts.bold}
		}

		:host:before {
			content: "";
			height: 160px;
			left: 0;
			position: absolute;
			top: 0;
			width: 100%;
			-webkit-app-region: drag;
			z-index: -1;
		}
	`,

	divider: css`
		:host {
			background-color: ${colors.araGrey};
			height: 1px;
			width: 100%;
		}
	`,

	descriptionHolder: css`
		:host {
			display: flex;
			flex-direction: column;
			height: 60px;
			justify-content: space-between;
		}
	`,

	horizontalContainer: css`
		:host {
			display: flex;
			justify-content: space-between;
			margin-top: 20px;
		}
	`
}