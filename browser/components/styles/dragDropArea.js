'use strict'

const { colors, fonts } = require('styleUtils')
const { css } = require('css')

module.exports = {
	colors,
	fonts,

	container(highlighted) {
		if (highlighted) {
			return css`
				:host {
					border: 2px solid var(--ara-grey);
					height: 100%;
					width: 100%;
				}
			`
		} else {
			return  css`
				:host {
					border: 2px solid white;
					height: 100%;
					width: 100%;
				}
			`
		}
 	}
}