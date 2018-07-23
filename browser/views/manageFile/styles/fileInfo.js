'use strict'

const { fonts } = require('styleUtils')
const { css } = require('css')

module.exports = {
	fonts,

	container: css`
		:host {
			display: flex;
			flex-direction: column;
			height: 280px;
			justify-content: space-between;
			padding-top: 1px;
		}

		:host b {
			font-family: ${fonts.bold};
		}
	`,

	infoTipHolder: css`
		:host {
			display: flex;
			flex-direction: column;
			font-family: ${fonts.light};
			font-size: 12px;
			height: 75px;
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