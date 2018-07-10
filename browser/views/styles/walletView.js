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
      width: 100%;
      height: 75px;
      align-items: left;
		}
	`,

	priceContainer: css`
	:host {
		display: flex;
		flex-direction: row;
		width: 100%;
		justify-content: flex-start;
		align-items: flex-end;
		background-color: red;
	}
`,  
}