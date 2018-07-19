'use strict'

const Button = require('../../components/button')
const FileInfo = require('./fileInfo')
const OptionsCheckbox = require('../../components/optionsCheckbox')
const UtilityButton = require('../../components/utilityButton')
const styles = require('./styles/container')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class Container extends Nanocomponent {
	constructor() {
		super()

		this.state = {
			currency: '',
			fileName: '',
			filePath: '',
			price: '',
			supernode: true,
			priceManagement: true
		}

		this.children = {
			fileInfo: new FileInfo({
				parentState: this.state
			}),
			supernodeCheckbox: new OptionsCheckbox({
				field: 'supernode',
				parentState: this.state
			}),
			priceMaintanenceCheckbox: new OptionsCheckbox({
				field: 'priceManagement',
				parentState: this.state
			}),
			publishButton: new Button({
				children: 'Publish', onclick:
				this.publishFile.bind(this)
			}),
			utilityButton: new UtilityButton({})
		}
	}

	update(){
		return true
	}

	publishFile() {
		console.log(this.state)
	}

	createElement() {
		const { children, state } = this
		return html`
			<div class=${styles.container}>
				<div class="${styles.titleHolder} ${styles.title}">
					Publish File
					${children.utilityButton.render({})}
				</div>
				<div class="${styles.content}">
					Publish your content for distribution on the ARA Network. You can publish a single file or an entire directory as a single
					asset. Once published, use the provided distribution link to allow users to purchase your content.<br><br>
					<b>Note:</b> ARA is a decentralized network. at least one computer or supernode must be connected and hosting this file for users
					to be able to download it.
				</div>
				<div class=${styles.divider}></div>
				${children.fileInfo.render()}
				<div class="${styles.optionsHolder}">
					${children.supernodeCheckbox.render()}
					${children.priceMaintanenceCheckbox.render()}
				</div>
				${children.publishButton.render()}
			</div>
		`
	}
}

module.exports = Container