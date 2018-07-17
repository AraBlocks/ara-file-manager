'use strict'

const fileSystemManager = require('../lib/store/fileSystemManager')
const styles = require('./styles/fileSelector')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class FileSelector extends Nanocomponent {
	constructor({
		field,
		parentState
	}) {
		super()
		this.props = { field, parentState }
		this.state = { filePath: '' }
		this.onclick = this.onclick.bind(this)
	}

	update({ filePath }) {
		const { state } = this
		const samePath = state.filePath === filePath
		if (!samePath) {
			state.filePath = filePath
		}
		return !samePath
	}

	onclick() {
		const { state, props } = this
		fileSystemManager.showSelectFileDialog()
			.then(((fileNames) => {
				state.filePath = fileNames[0]
				props.parentState[props.field] = fileNames[0]
				this.rerender()
			}))
			.catch(console.log)
	}

	createElement() {
		const { onclick, state } = this
		return html`
			<div class=${styles.container} onclick=${onclick}>
				<div class=${styles.filePath(state.filePath !== '')}>
					${state.filePath == '' ? 'File Directory' : state.filePath}
				</div>
			</div>
		`
	}
}

module.exports = FileSelector