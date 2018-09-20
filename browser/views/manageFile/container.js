'use strict'

const Button = require('../../components/button')
const { emit, getDistributionLink } = require('../../lib/tools/windowManagement')
const FileInfo = require('./fileInfo')
const OptionsCheckbox = require('../../components/optionsCheckbox')
const overlay = require('../../components/overlay')
const { UPDATE_FILE } = require('../../../lib/constants/stateManagement')
const styles = require('./styles/container')
const UtilityButton = require('../../components/utilityButton')
const { remote } = require('electron')
const windowManager = remote.require('electron-window-manager')
const { account } = windowManager.sharedData.fetch('store')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class Container extends Nanocomponent {
	constructor({
		currency,
		fileAid,
		fileName,
		filePath,
		price,
		priceManagement,
		supernode,
		tokenPrice,
	}) {
		super()
		this.state = {
			currency,
			distributionLink: getDistributionLink(fileAid, fileName),
			fileAid,
			fileName,
			filePath,
			price,
			priceManagement,
			supernode,
			tokenPrice,
		}

		this.children = {
			deleteButton: new Button({
				children: 'Delete From Network',
				cssClass: {
					name: 'smallInvisible',
					opts: {
						color: 'blue',
						weight: 'bold',
						height: '36px'
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

	updateFile() {
		const load = {
			fileAid: this.state.fileAid,
			name: this.state.fileName,
			password: account.password,
			paths: this.state.filePath,
			price: this.state.price,
			userAid: account.userAid
		}
		emit({ event: UPDATE_FILE, load })
	}

	createElement({ spinner = false }) {
		const { children, state } = this
		return html`
			<div class="${styles.container} ManageFileContainer-container">
				${overlay(spinner)}
				<div class="${styles.horizontalContainer} ${styles.title} ManageFileContainer-horizontalContainer,title">
					Manage File
					${children.utilityButton.render({ children: '✕' })}
				</div>
				<div class="${styles.content} ManageFileContainer-content">
					This file has been published to the ARA Network. You can edit and update the file here. The changes will be pushed to all users on the network.<br><br>
					This is also where you can find this file’s <b>distribution</b> link, which you will need for users to purchase this file with their Littlstar File Manager.
				</div>
				<div class="${styles.divider} ManageFileContainer-divider"></div>
				${children.fileInfo.render({ parentState: state })}
				<div class="${styles.horizontalContainer} ManageFileContainer-horizontalContainer">
					${children.supernodeCheckbox.render({ parentState: state })}
					${children.priceManagementCheckbox.render({ parentState: state })}
				</div>
				${children.publishButton.render()}
				${children.deleteButton.render()}
			</div>
		`
	}
}

module.exports = Container