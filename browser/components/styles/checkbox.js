'use strict'

const {
	colors,
	colorSelector,
	fonts
} = require('styleUtils')
const { css } = require('css')

module.exports = {
	colors,
	fonts,

	container({
		checked,
		opts: {
			colorChecked = colors.araRed,
			colorUnchecked = 'grey'
		}
	}) {
		return css`
			:host {
				width: 30px;
				height: 30px;
				background-color: white;
				border: 2px solid ${
					checked
						? colorSelector(colorChecked)
						: colorSelector(colorUnchecked)
				};
				cursor: pointer;
				-webkit-app-region: no-drag;
			}
		`
	},

	checkmark({
		checked,
		opts: { colorChecked = colors.araRed }
	}) {
		return css`
			:host {
				font-size: 30px;
				color: ${colorChecked};
				text-align: center;
				display: ${checked ? "block" : "none"};
			}
		`
	}
}