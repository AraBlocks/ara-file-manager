'use strict'

const { colors, colorSelector, fonts } = require('styleUtils')
const { css } = require('css')

module.exports = {
	fonts,

	container: css`
		:host {
			display: flex;
			flex-direction: column;
			height: 460px;
			justify-content: space-between;
			padding-top: 25px;
		}

		:host b {
			font-family: ${fonts.bold};
		}
	`,

	araPriceHolder: css`
		:host {
			display: none;
		}
	`,

	araPrice: css`
		:host {
			color: ${colors.araBlue};
			padding-left: 4px;
		}
	`,

	errorMsg: css`
		:host {
			color: ${colorSelector('red')};
			font-size: 10px;
			height: 13px;
			width: 100%;
		}
	`,

	distributionLink: css`
		:host {
			padding-top: 10px;
		}
	`,

	fileTable: css`
		:host {
			height: 270px;
			padding-top: 10px;
			width: 100%;
		}
	`,

	infoTipHolder: css`
		:host {
			display: flex;
			flex-direction: column;
			font-family: ${fonts.light};
			font-size: 12px;
			height: 70px;
			justify-content: space-between;
			width: 49%;
		}
	`,

	infoTip: css`
		:host {
			display: flex;
			flex-direction: column;
			height: 49%;
			justify-content: center;
		}
	`,

	verticalContainer: css`
		:host {
			display: flex;
			justify-content: space-between;
			width: 100%;
		}
	`
}