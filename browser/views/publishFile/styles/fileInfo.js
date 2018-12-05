'use strict'

const { fonts, colorSelector } = require('styleUtils')
const { css } = require('css')

module.exports = {
	fonts,

	container: css`
		:host {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			padding-top: 1px;
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

	infoTipHolder: css`
		:host {
			display: flex;
			flex-direction: column;
			font-family: ${fonts.light};
			font-size: 12px;
			height: 130px;
			justify-content: flex-end;
			width: 49%;
		}

		:host b {
			font-family: ${fonts.bold};
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

	fileDirectoryHolder: css`
		:host {
			padding-top: 10px;
			height: 360px;
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