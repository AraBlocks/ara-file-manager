'use strict'

const { colors, fonts } = require('styleUtils')
const { css } = require('css')

module.exports = {
	colors,
	fonts,

	container: css`
		:host {
      align-items: left;
      display: flex;
      flex-direction: column;
      height: 75px;
      justify-content: space-between;
      width: 100%;
		}
	`,

	priceContainer: css`
		:host {
			align-items: flex-end;
			display: flex;
			flex-direction: row;
			justify-content: flex-start;
			width: 100%;
		}
	` 
}