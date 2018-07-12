'use strict'

const { colors, fonts, fontCSS } = require('styleUtils')
const { css } = require('css')

module.exports = {
	colors,
	fonts,
	fontCSS,
	header: fontCSS.proxiContent,
	subHeader: fontCSS.noeH1,

	container: css`
		:host {
			background-color: white;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			height: 100%;
			padding: 10px 10px 0px 10px;
			align-items: center;
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
			align-items: center;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			width: 100%;
		}
	`,  

	bottomAlign: css`
		:host {
			align-items: flex-end;
			justify-content: flex-start;
			width: 100%;
		}
	`,  
}