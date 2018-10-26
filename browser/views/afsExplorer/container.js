'use strict'

const DragDropArea = require('../../components/dragDropArea')
const AfsFileDescriptor = require('../../components/afsFileTable/afsFileTable')
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
			dragDropArea: new DragDropArea({ onFileDrop: this.onFileDrop }),
			afsFileDescriptor: new AfsFileDescriptor({
				parentDirectory: 'Cats!!',
				fileList: [
					{ name: 'buff_cat', size: 10000, type: 'Video File', did: '123'},
					{ name: 'grump_cat', size: 20000, type: 'PNG File', did: '456' },
					{ name: 'mango!', size: 30000, type: 'Folder', did: '679' }
				]
			})
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
				${children.afsFileDescriptor.render()}
				${children.dragDropArea.render({})}
			</div>
		`
	}
}

module.exports = Container