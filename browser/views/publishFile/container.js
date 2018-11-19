'use strict'

const Button = require('../../components/button')
const { emit } = require('../../lib/tools/windowManagement')
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
	constructor({ account }) {
		super()

		this.state = {
			currency: '',
			fileName: '',
			fileList: [],
			price: null,
		}

		this.props = { account }

		this.children = {
			fileInfo: new FileInfo({
				parentState: this.state,
				renderView: this.renderView.bind(this)
			}),
			publishButton: new Button({
				children: ['Publish'],
				cssClass: { name: 'thinBorder'},
				onclick: this.publishFile.bind(this)
			}),
			utilityButton: new UtilityButton({})
		}

	}

	update() {
		return true
	}

	renderView() {
		this.render({})
	}

	publishFile() {
		const { fileName, fileList, price } = this.state
		const { account } = this.props
		const paths = fileList.map(file => file.fullPath)
		const load = {
			userAid: account.userAid,
			password: account.password,
			paths,
			name: fileName || 'Unnamed',
			price
		}
		if (fileList.length != 0 && !account.pendingTransaction) {
			emit({ event: PUBLISH, load })
		}
		this.render({})
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
						Publish your content for distribution on the Ara Network. You can publish a single file or an entire directory as a single
						asset. Once published, use the provided distribution link to allow users to purchase your content.<br><br>
						<b>Note:</b> Ara is a decentralized network. at least one computer or supernode must be connected and hosting this file for users
						to be able to download it.
					</div>
					<div class="${styles.divider} PublishFileContainer-divider"></div>
					${children.fileInfo.render({})}
					${children.publishButton.render({
						cssClass: (state.fileList.length === 0) || props.account.pendingTransaction
							? { name: 'thinBorder' } : { name: 'standard' },
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