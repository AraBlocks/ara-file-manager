'use strict'

const Button = require('../../components/button')
const UtilityButton = require('../../components/utilityButton')
const styles = require('./styles/fileSection')
const windowManagement = require('../../lib/store/windowManagement')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class FileSection extends Nanocomponent {
	constructor({ expandedState, windowName }) {
		super()
		this.state = { expandedState }
		this.children = {
			expandWindowButton: new UtilityButton( { 
				children: '▼', 
				onclick: () => { 
					if (windowManagement.getHeight(windowName) == 525) {
						windowManagement.setWindowSize(windowName, 400, 325)
						this.state.expandedState = 0
					} else {
						windowManagement.setWindowSize(windowName, 400, 525)
						this.state.expandedState = 1
					}
					this.rerender()
				} 
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

	update({ expandedState }) {
		const sameState = this.state.expandedState == expandedState
		if (!sameState) {
			this.state.expandedState = expandedState
		}
		return !sameState
	}

	createElement() {
		const { state, children } = this	
		return html`
			<div class="${styles.container} FileSection-container">
				<div class="${styles.horizontalContainer} FileSection-horizontalContainer">
					<div class="${styles.header} FileSection-Header">
						Files
					</div>
					${children.expandWindowButton.render({})}
				</div>
				${divider(true)}
				<div class="${styles.flexibleContainer( state.expandedState )} FileSection-flexibleContainer"></div>
				${divider(false)}
				${children.fileManagerButton.render()}
			</div>
		`
		function divider(alwaysVisible) {
			if ( state.expandedState == 0 && !alwaysVisible ) {
				return
			}
			return html`<div class="${styles.divider} MainManagerView-divider"></div>`
		}
	}
}

module.exports = FileSection