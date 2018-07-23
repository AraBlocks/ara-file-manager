'use strict'

const Button = require('../../components/button')
const FileInfo = require('./fileInfo')
const OptionsCheckbox = require('../../components/optionsCheckbox')
const styles = require('./styles/container')
const UtilityButton = require('../../components/utilityButton')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class Container extends Nanocomponent {
	constructor({
		currency,
		distributionLink,
		fileName,
		filePath,
		price,
		priceManagement,
		supernode,
		tokenPrice,
		userData
	}) {
		super()

		this.state = {
			currency,
			distributionLink,
			fileName,
			filePath,
			price,
			priceManagement,
			supernode,
			tokenPrice,
			userData
		}

		this.children = {
			deleteButton: new Button({
				children: 'Delete From Network',
				cssClass: {
					name: 'smallInvisible',
					opts: {
						color: 'blue',
						weight: 'bold'
					}
				}
			}),
			fileInfo: new FileInfo({
				parentState: this.state,
			}),
			supernodeCheckbox: new OptionsCheckbox({
				field: 'supernode',
				parentState: this.state
			}),
			priceManagementCheckbox: new OptionsCheckbox({
				field: 'priceManagement',
				parentState: this.state
			}),
			publishButton: new Button({
				children: 'Update',
				onclick: this.updateFile.bind(this)
			}),
			utilityButton: new UtilityButton({})
		}
	}

	update(){
		return true
	}

	updateFile() {}

	createElement() {
		const { children } = this
		return html`
			<div class="${styles.container} ManageFileContainer-container">
				<div class="${styles.horizontalContainer} ${styles.title} ManageFileContainer-horizontalContainer,title">
					Manage File
					${children.utilityButton.render({})}
				</div>
				<div class="${styles.content} ManageFileContainer-content">
					This file has been published to the ARA Network. You can edit and update the file here. The changes will be pushed to all users on the network.<br><br>
					This is also where you can find this file’s <b>distribution</b> link, which you will need for users to purchase this file with their Littlstar File Manager.
				</div>
				<div class="${styles.divider} ManageFileContainer-divider"></div>
				${children.fileInfo.render()}
				<div class="${styles.horizontalContainer} ManageFileContainer-horizontalContainer">
					${children.supernodeCheckbox.render()}
					${children.priceManagementCheckbox.render()}
				</div>
				${children.publishButton.render()}
				${children.deleteButton.render()}
			</div>
		`
	}
}

module.exports = Container