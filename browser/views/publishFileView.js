'use strict'

// const styles = require('./styles/tooltip')
const FileInfo = require('./publishFile/fileInfo')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class PublishFileVIew extends Nanocomponent {
	constructor() {
		super()
		this.state = {}
		this.fileInfo = new FileInfo({
			parentState: this.state
		})
	}

	update(){
		return true
	}

	createElement() {
		const { fileInfo } = this
		return html`
			<div>
				${fileInfo.render()}
				<button onclick=${() => console.log(this.state)}>Log state</button>
			</div>
		`
	}
}

module.exports = PublishFileVIew