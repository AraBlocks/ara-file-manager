'use strict'

const { colors, fonts } = require('styleUtils')
const { css } = require('css')

module.exports = {
	colors,
	fonts,

	container(highlighted) {
		return  css`
			:host {
				border: 2px solid ${highlighted ? 'var(--ara-grey)' : 'white'};
				height: 100%;
				width: 100%;
			}
		`
 	}
}