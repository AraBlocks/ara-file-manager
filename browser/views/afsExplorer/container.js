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
		this.children = {
			dragDropArea: new DragDropArea({ field: 'fileList', parentState: this.state })
		}
	}

	update(){
		return true
	}

	createElement() {
		const { children } = this
		return html`
			<div class=${styles.container}>
				${children.dragDropArea.render()}
			</div>
		`
	}
}

module.exports = Container