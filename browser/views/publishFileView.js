'use strict'

// const styles = require('./styles/tooltip')
const FileInfo = require('./publishFile/fileInfo')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class PublishFileVIew extends Nanocomponent {
	constructor() {
		super()
		this.props = {}
		this.fileInfo = new FileInfo()
	}

	update(){
		return true
	}

	createElement() {
		// const { props } = this
		return html`
		`
	}
}

module.exports = PublishFileVIew