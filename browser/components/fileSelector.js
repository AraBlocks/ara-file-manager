'use strict'

const fileSystemManager = require('../lib/store/fileSystemManager')
const Input = require('../components/input')
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
		this.children = { input: new Input({
			placeholder: 'File Directory',
			field,
			parentState,
			embeddedButton: {
				option: 'button',
        children: 'Select',
        onclick: this.selectFile.bind(this)
      }
		})}
	}

	update({ filePath }) {
		const { state } = this
		const samePath = state.filePath === filePath
		if (!samePath) {
			state.filePath = filePath
		}
		return !samePath
	}

	selectFile() {
		const { state, props } = this
		fileSystemManager.showSelectFileDialog()
			.then(fileNames => {
				state.filePath = fileNames[0]
				props.parentState[props.field] = fileNames[0]
				this.rerender()
			})
			.catch(console.log)
	}

	createElement() {
		const { state, children } = this
		return html`
			<div>
				${children.input.render({value: state.filePath})}
			</div>
		`
	}
}

module.exports = FileSelector