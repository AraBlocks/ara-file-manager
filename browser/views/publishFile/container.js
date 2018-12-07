'use strict'

const Button = require('../../components/button')
const { windowManagement, fileSystemManager } = require('../../lib/tools')
const FileInfo = require('./fileInfo')
const { PUBLISH } = require('../../../lib/constants/stateManagement')
const overlay = require('../../components/overlay')
const UtilityButton = require('../../components/utilityButton')
const styles = require('./styles/container')
const filesize = require('filesize')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')
const tooltip = require('../../lib/tools/electron-tooltip')

class Container extends Nanocomponent {
	constructor({ account, contentDID }) {
		super()

		this.state = {
			currency: '',
			fileName: '',
			fileList: [],
			price: ''
		}

		this.props = { account, contentDID }

		this.children = {
			fileInfo: new FileInfo({
				addItems: this.addItems.bind(this),
				parentState: this.state,
				renderView: () => this.render.bind(this)({})
			}),
			publishButton: new Button({
				cssClass: { name: 'thinBorder'},
				children: [
					'Publish',
					html`<span style="font-family: ProximaNova-light;"> (0 B)</span>`
				],
				onclick: this.publishFile.bind(this)
			}),
			utilityButton: new UtilityButton({
				onclick: () => {
					windowManagement.emit({ event: k.CHANGE_PENDING_TRANSACTION_STATE, load: false })
					windowManagement.closeWindow()
				}
			})
		}

		this.rerender = this.rerender.bind(this)
	}

	addItems(items) {
		const itemsInfo = items.map(fileSystemManager.getFileInfo)
		this.state.fileList.push(...itemsInfo)
		this.rerender()
	}

	publishFile() {
		const { fileName, fileList, price } = this.state
		const { account, contentDID } = this.props
		const paths = fileList.map(file => file.fullPath)
		const load = {
			contentDID,
			userAid: account.userAid,
			password: account.password,
			paths,
			name: fileName,
			price: Number(price) === 0 ? '' : price
		}

		if (fileList.length !== 0 && price >= 0) { windowManagement.emit({ event: PUBLISH, load }) }
		this.render({})
	}

	update() {
		return true
	}

	createElement({ spinner = false }) {
		tooltip({})
		const { children, state, props } = this
		return html`
			<div>
				${overlay(spinner)}
				<div class="${styles.container} PublishFileContainer-container">
					<div class="${styles.horizontalContainer} ${styles.title} PublishFileContainer-horizontalContainer,title">
						Publish File
						${children.utilityButton.render({ children: 'close' })}
					</div>
					<div class="${styles.content} PublishFileContainer-content">
						Publish your package for distribution on the Ara Network. You can publish a single file or an entire directory as a single
						asset. Once published, use the provided distribution link to allow users to purchase your package.<br><br>
						<b>Note:</b> Ara is a decentralized network. at least one computer must be connected and hosting this file for users
						to be able to download it.
					</div>
					<div class="${styles.divider} PublishFileContainer-divider"></div>
					${children.fileInfo.render({})}
					${children.publishButton.render({
						cssClass: (state.fileList.length != 0 && state.price >= 0)
							? { name: 'standard' }
							: { name: 'thinBorder' },
						children: [
							'Publish',
							html`
								<span style="font-family: ProximaNova-light;">
									(${ filesize(state.fileList.reduce((sum, file) => sum += file.size, 0)) })
								</span>`
						]
					})}
				</div>
			</div>
		`
	}
}

module.exports = Container