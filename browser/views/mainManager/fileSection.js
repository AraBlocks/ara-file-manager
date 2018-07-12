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
		this.state = { expanded: false }
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
		this.state.expanded = !this.state.expanded
		windowManagement.changeMainManagerSize(this.windowName, this.state.expanded)
		this.rerender()
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
					${renderExpandButton()}
				</div>
				${divider()}
				<div class="${styles.flexibleContainer(state.expanded)} FileSection-flexibleContainer"></div>
				${state.expanded ? divider() : null}
				${children.fileManagerButton.render()}
			</div>
		`
		function divider() {
			return html`<div class="${styles.divider} MainManagerView-divider"></div>`
		}

		function renderExpandButton() {
			return (state.expanded) 
				? children.expandWindowButton.render({ children: '▲' }) 
				: children.expandWindowButton.render({ children: '▼' })
		}
	}
}

module.exports = FileSection