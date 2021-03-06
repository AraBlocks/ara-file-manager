const { colors, fonts } = require('styleUtils')
const { css } = require('css')

module.exports = {
	colors,
	fonts,

	contextMenu: css`
		:host {
			height: 5px;
			display: none;
			background-color: red;
			position: absolute;
			width: 5px;
			-webkit-app-region: no-drag;
		}

		:host:before {
			content: "";
			position: absolute;
			left: -12px;
			top: -12px;
			height: 12px;
			width: 30px;
			z-index: 999;
		}

		:host:after {
			content: "";
			position: absolute;
			left: -12px;
			top: -12px;
			height: 30px;
			width: 12px;
			z-index: 999;
		}
	`,

	fileNameCell: css`
		:host {
			cursor: pointer;
			height: 2em;
			overflow: hidden;
    	text-overflow: ellipsis;
			width: 350px;
    	white-space: nowrap;
		}
	`,

	fileImage: css`
		:host {
			height: 22px;
			width: 22px;
			padding-right: 10px;
		}
	`,

	menuItem: css`
		:host {
			background-color: white;
			border: 1px solid #e9e9e9;
			cursor: pointer;
			font-family: ${fonts.light};
			font-size: 13px;
			height: 2em;
			line-height: 2em;
			padding: 0 5px;
      text-align: center;
      text-overflow: ellipsis;
      vertical-align: middle;
			width: 100px;
			z-index: 1;
		}

		:host:hover {
			background-color: #eeeeee;
    }
	`
}