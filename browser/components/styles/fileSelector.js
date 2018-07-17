'use strict'

const { fonts } = require('styleUtils')
const { css } = require('css')

module.exports = {
	fonts,

	container: css`
			:host {
				border: 1px solid var(--ara-input-grey);
				cursor: pointer;
				display: flex;
				flex-direction: column;
				height: 50px;
				justify-content: center;
				width: 90%;
			}
	`,

	filePath(fileSelected) {
		return css`
			:host {
				color: ${fileSelected ? 'black' : 'var(--ara-input-grey)'};
				font-family: ${fonts.light};
				font-size: 20px;
				overflow: hidden;
				text-indent: 10px;
				text-overflow: ellipsis;
				width: 100%;
				white-space: nowrap;
			}
		`
	}
}