'use strict'

const styles = require('./styles/dragDropArea')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class DragDropArea extends Nanocomponent {
	constructor({ field, parentState }) {
		super()
		this.props = {
			field,
			parentState
		}
		this.state = { fileList: null }
		this.ondrop = this.ondrop.bind(this)
		this.highlight = this.highlight.bind(this)
		this.unhilight = this.unhilight.bind(this)
	}

	update(){
		return true
	}

	highlight(e) {
		e.preventDefault()
		e.stopPropagation()
		e.target.classList.add(styles.selected)
	}

	unhilight(e) {
		e.preventDefault()
		e.stopPropagation()
		e.target.classList.remove(styles.selected)
	}

	ondrop(e) {
		e.preventDefault()
		e.stopPropagation()
		e.target.classList.remove(styles.selected)
		const { state, props } = this
		const data = e.dataTransfer
		const files = data.files
		state.fileList = files
		props.parentState[props.field] = files
		console.log(files)
	}

	createElement() {
		const { highlight, ondrop, unhilight } = this
		return html`
			<div
				class="${styles.container}"
				ondrop=${ondrop}
				ondragenter=${highlight}
				ondragover=${highlight}
				ondragleave=${unhilight}
			>
			</div>
		`
	}
}

module.exports = DragDropArea