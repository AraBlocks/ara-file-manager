'use strict'

const { fonts } = require('styleUtils')
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

	infoTipHolder: css`
		:host {
			display: flex;
			flex-direction: column;
			font-family: ${fonts.light};
			font-size: 12px;
			height: 110px;
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
			width: 100%;
			padding-top: 10px;
			height: 380px;
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