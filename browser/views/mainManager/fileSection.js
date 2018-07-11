'use strict'

const Button = require('../../components/button')
const UtilityButton = require('../../components/utilityButton')
const styles = require('./styles/fileSection')
const windowManagement = require('../../lib/store/windowManagement')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class FileSection extends Nanocomponent {
	constructor({ windowName }) {
		super()
		this.state = { expandedState: 0 }
		this.windowName = windowName
		this.children = {
			expandWindowButton: new UtilityButton( { 
				children: '▼', 
				onclick: this.changeWindowSize.bind(this)
			}),
			fileManagerButton: new Button({
        children: 'Open File Manager',
        cssClass: {
          name: 'smallInvisible',
          opts: {
            color: 'black',
            weight: 'bold'
          }
        }
			}), 
		}
	}

	changeWindowSize() {
		this.state.expandedState = (this.state.expandedState == 0) ? 1 : 0
		windowManagement.changeMainManagerSize(this.windowName, this.state.expandedState == 1)
		this.rerender()
	}

	renderExpandButton() {
		if (this.state.expandedState == 0) {
			return this.children.expandWindowButton.render({ children: '▼'})
		} else {
			return this.children.expandWindowButton.render({ children: '▲'})
		}
	}

	update() {
		return true
	}

	createElement() {
		const { state, children } = this	
		return html`
			<div class="${styles.container} FileSection-container">
				<div class="${styles.horizontalContainer} FileSection-horizontalContainer">
					<div class="${styles.header} FileSection-Header">
						Files
					</div>
					${this.renderExpandButton()}
				</div>
				${divider()}
				<div class="${styles.flexibleContainer(state.expandedState)} FileSection-flexibleContainer"></div>
				${state.expandedState == 0 ? null : divider()}
				${children.fileManagerButton.render()}
			</div>
		`
		function divider() {
			return html`<div class="${styles.divider} MainManagerView-divider"></div>`
		}
	}
}

module.exports = FileSection