'use strict'

const Button = require('../../components/button')
const deeplink = require('../../lib/tools/deeplink')
const { emit } = require('../../lib/tools/windowManagement')
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
		did,
		name,
		fileList,
		price,
		priceManagement,
		supernode,
		tokenPrice,
	}) {
		super()
		this.state = {
			currency,
			did,
			distributionLink: deeplink.getDeeplink(did, name),
			name,
			fileList,
			price,
			priceManagement,
			supernode,
			tokenPrice,
		}

		this.props = {
			afsContents: fileList
		}

		this.children = {
			// deleteButton: new Button({
			// 	children: 'Delete From Network',
			// 	cssClass: {
			// 		name: 'smallInvisible',
			// 		opts: {
			// 			color: 'blue',
			// 			weight: 'bold',
			// 			height: '36px'
			// 		}
			// 	}
			// }),
			fileInfo: new FileInfo({
				did,
				parentState: this.state,
			}),
			publishButton: new Button({
				children: 'Publish Update',
				onclick: this.updateFile.bind(this)
			}),
			utilityButton: new UtilityButton({})
		}
	}

	update(){
		return true
	}

	updateFile() {
		const { state, props } = this
		const subPaths = state.fileList.map(file => file.subPath)
		const removePaths = props.afsContents.filter(file =>
			!subPaths.includes(file.subPath)
		).map(file => file.subPath)
		const addPaths = state.fileList.filter(file =>
			file.fullPath != null
		).map(file => file.fullPath)

		const load = {
			addPaths,
			did: state.did,
			name: state.name,
			password: account.password,
			removePaths,
			price: state.price == "" ? null : state.price,
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
				${children.publishButton.render()}
			</div>
		`
	}
}

module.exports = Container