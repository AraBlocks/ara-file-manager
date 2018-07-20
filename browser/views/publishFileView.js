'use strict'

const FileInfo = require('./publishFile/fileInfo')
const PublishFileContainer = require('./publishFile/container')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

const { remote } = require('electron')
const windowManager = remote.require('electron-window-manager')

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
		return html`
			<div>
				${publishFileContainer.render()}
			</div>
		`
	}
}

module.exports = PublishFileVIew