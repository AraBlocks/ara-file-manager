'use strict'

const FileInfo = require('./publishFile/fileInfo')
const PublishFileContainer = require('./publishFile/container')
const html = require('nanohtml')
const Nanocomponent = require('nanocomponent')

class PublishFileVIew extends Nanocomponent {
	constructor() {
		super()
		this.state = {}
		this.fileInfo = new FileInfo({
			parentState: this.state
		})
		this.publishFileContainer = new PublishFileContainer()
	}

	update(){
		return true
	}

	createElement() {
		const { publishFileContainer } = this
		return html`<div>${publishFileContainer.render()}</div>`
	}
}

module.exports = PublishFileVIew