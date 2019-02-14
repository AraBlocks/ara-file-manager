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
		disabled,
		opts: {
			colorChecked = 'green',
			colorUnchecked = 'grey'
		}
	}) {
		return css`
			:host {
				background-color: white;
				border: 2px solid ${colorSelector( checked ? colorChecked : colorUnchecked)};
				color: ${colorSelector(colorChecked)};
				cursor: ${disabled ? 'not-allowed' : 'pointer'};
				display: flex;
				font-size: 35px;
				height: 30px;
				justify-content: center;
				width: 30px;
				-webkit-app-region: no-drag;
			}
		`
	},

	checkmark({ checked, opts: { colorChecked = 'green' }}) {
		return css`
			:host {

				text-align: center;
				display: ${checked ? "block" : "none"};
			}
		`
	}
}