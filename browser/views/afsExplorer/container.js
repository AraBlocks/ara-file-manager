'use strict'

const DragDropArea = require('../../components/dragDropArea')
const styles = require('./styles/container')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class Container extends Nanocomponent {
	constructor() {
		super()
		this.props = {}
		this.state = {
			fileList: null
		}
		this.onFileDrop = this.onFileDrop.bind(this)
		this.children = {
			dragDropArea: new DragDropArea({ onFileDrop: this.onFileDrop })
		}
	}

	onFileDrop(e) {
		const { state } = this
 		const data = e.dataTransfer
		const files = data.files
		state.fileList = files
		console.log(state.fileList)
	}

	update(){
		return true
	}

	createElement() {
		const { children } = this
		return html`
			<div class=${styles.container}>
				${children.dragDropArea.render({})}
			</div>
		`
	}
}

module.exports = Container