'use strict'

const { colors, fonts, fontCSS } = require('styleUtils')
const { css } = require('css')

module.exports = {
	colors,
	fonts,
	subHeader: fontCSS.noeH1,

	container(status) {
		let height
		switch (status) {
			case 0:
				height = 0
				break
			default:
				height = 199;
		}

		return css`
			:host {
				width: 100%;
				height: ${height}px;
			}
		`
	}, 

	divider: css`
		:host {
			background-color: ${colors.araGrey};
			height: 1px;
			width: 100%;
		}
	`,

	verticalContainer: css`
		:host {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			height: 100%;
			padding: 10px 10px 0px 10px;
			align-items: center;
		}
	`,

	verticalContainerSmall: css`
		:host {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			width: 100%;
			align-items: center;
		}
	`,

	horizontalContainer: css`
		:host {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			width: 100%;
		}
	`,  
}