'use strict'

const Button = require('../../components/button')
const ItemRow = require('./itemRow')
const UtilityButton = require('../../components/utilityButton')
const styles = require('./styles/fileSection')
const windowManagement = require('../../lib/tools/windowManagement')
const html = require('nanohtml')
const Nanocomponent = require('nanocomponent')

class FileSection extends Nanocomponent {
	constructor({
		files = []
	}) {
		super()
		this.state = { expanded: false, files: this.makeRows(files) }
		this.children = {
			expandWindowButton: new UtilityButton({
				children: 'downArrow',
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
				},
				onclick: () => windowManagement.openWindow('filemanager')
			}),
		}
	}

	changeWindowSize() {
		this.state.expanded = !this.state.expanded
		windowManagement.changeMainManagerSize(this.state.expanded)
		this.rerender()
	}

	makeRows(files) {
		return files.map(file => new ItemRow({ ...file }))
	}

	update({ files }) {
		const { state } = this
		const isSame = state.files.length == files.length
		if (!isSame) {
			state.files = this.makeRows(files)
		}
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
				<div class="${styles.flexibleContainer(state.expanded)} FileSection-flexibleContainer">
					${state.files.map(file => file.render({
						downloadPercent: file.state.downloadPercent,
						status: file.state.status
					}))}
				</div>
				${state.expanded ? divider() : null}
				${children.fileManagerButton.render({})}
			</div>
		`
		function divider() {
			return html`<div class="${styles.divider} MainManagerView-divider"></div>`
		}

		function renderExpandButton() {
			return (state.expanded)
				? children.expandWindowButton.render({ children: 'upArrow' })
				: children.expandWindowButton.render({ children: 'downArrow' })
		}
	}
}

module.exports = FileSection