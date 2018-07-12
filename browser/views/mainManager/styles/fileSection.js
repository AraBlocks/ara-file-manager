'use strict'

const { colors, fonts, fontCSS } = require('styleUtils')
const { css } = require('css')

module.exports = {
	colors,
	fonts,
	header: fontCSS.noeH1,

	flexibleContainer(expanded) {
		let height = 0
		if (expanded) {
			height = 199
		} 
		return css`
			:host {
				height: ${height}px;
				width: 100%;
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
			justify-content: space-between;
			width: 100%;
		}
	`,  
}