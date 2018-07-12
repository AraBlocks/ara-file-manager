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

	container({ checked, 
		opts: { 
			colorChecked = 'red',
			colorUnchecked = 'grey'
		}
	}) {
		return css`
			:host {
				width: 50px;
				height: 50px;
				background-color: white;
				border: 2px solid ${checked 
					? colorSelector(colorChecked) 
					: colorSelector(colorUnchecked)
				};
			}
		`
	},

	checkmark({ 
		checked, 
		opts: { colorChecked = 'red' }
	}) {
		return css`
			:host {
				font-size: 40px;
				color: ${colorChecked};
				text-align: center;
				display: ${checked ? "block" : "none"};
			}
		`
	}
}