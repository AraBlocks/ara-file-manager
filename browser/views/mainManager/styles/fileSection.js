'use strict'

const { colors, fonts, fontCSS } = require('styleUtils')
const { css } = require('css')

module.exports = {
	colors,
	fonts,
	header: fontCSS.noeH1,

	flexibleContainer(status) {
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

	container: css`
		:host {
			align-items: center;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			width: 100%;
		}
	`,
	
	divider: css`
		:host {
			background-color: ${colors.araGrey};
			height: 1px;
			width: 100%;
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