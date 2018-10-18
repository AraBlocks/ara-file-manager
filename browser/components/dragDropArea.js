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
	}

	update(){
		return true
	}

	onhighlight(e) {
		e.preventDefault()
		e.stopPropagation()
	}

	ondrop(e) {
		e.preventDefault()
		e.stopPropagation()
		const { state, props } = this
		const data = e.dataTransfer
		const files = data.files
		state.filePath = files
		props.parentState[props.field] = files
		console.log(props.parentState)
	}

	createElement() {
		const { ondrop } = this
		return html`
			<div
				class=${styles.container}
				ondrop=${ondrop}
			>
			</div>
		`
	}
}

module.exports = DragDropArea