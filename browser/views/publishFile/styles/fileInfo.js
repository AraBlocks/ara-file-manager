'use strict'

const { colors, fonts } = require('styleUtils')
const { css } = require('css')

module.exports = {
	colors,
	fonts,

	container: css`
		:host {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			margin: 10px;
		}
	`,

	infoTipHolder: css`
		:host {
			font-family: ${fonts.light};
			font-size: 12px;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			width: 49%;
			height: 100px;
		}

		:host b {
			font-family: ${fonts.bold};
		}
	`,

	infoTip: css`
		:host {
			display: flex;
			flex-direction: column;
			justify-content: center;
			height: 49%;
		}
	`,

	fileDirectoryHoler: css`
		:host {
			padding-top: 10px;
		}
	`,

	verticalContainer: css`
		:host {
			display: flex;
			width: 100%;
			justify-content: space-between;
		}
	`
}