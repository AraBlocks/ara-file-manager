'use strict'

const styles = require('./styles/dragDropArea')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class DragDropArea extends Nanocomponent {
	constructor({ onFileDrop }) {
		super()
		this.props = {
			onFileDrop
		}
		this.highlight = this.highlight.bind(this)
		this.unhilight = this.unhilight.bind(this)
		this.ondrop = this.ondrop.bind(this)
		this.preventDefault = this.preventDefault.bind(this)
	}

	update(){
		return true
	}

	highlight(e) {
		this.preventDefault(e)
		this.render({ highlighted: true })
	}

	unhilight(e) {
		this.preventDefault(e)
		this.render({ highlighted: false })
	}

	preventDefault(e) {
		e.preventDefault()
		e.stopPropagation()
	}

	ondrop(e) {
		const { props } = this
		this.preventDefault(e)
		props.onFileDrop(e)
		this.render({ highlighted: false })
	}

	createElement({ highlighted = false }) {
		const { highlight, ondrop, preventDefault, unhilight } = this
		return html`
			<div
				class="${styles.container(highlighted)}"
				ondrop=${ondrop}
				ondragenter=${highlight}
				ongragover=${preventDefault}
				ondragleave=${unhilight}
			>
			</div>
		`
	}
}

module.exports = DragDropArea