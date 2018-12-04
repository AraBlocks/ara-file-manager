'use strict'

const Button = require('../components/button')
const { closeModal, closeWindow, emit } = require('../lib/tools/windowManagement')
const k = require('../../lib/constants/stateManagement')
const { utils } = require('../lib/tools')
const styles = require('./styles/deployEstimate')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class DeployEstimate extends Nanocomponent {
	constructor() {
		super()
		this.props = {
			gasEstimate: null
		}
		this.children = {
			publishButton: new Button({
				children: 'Confirm',
				cssClass: { name: 'thinBorder' },
				onclick: () => {
					if (this.props.gasEstimate) {
						emit({ event: k.CONFIRM_DEPLOY_PROXY, load: { did: this.props.did } }),
						closeModal('deployEstimate')
					}
				}
			}),
			cancelbutton: new Button({
				...styles.buttonSelector('cancel'),
				onclick: () => {
					closeWindow('deployEstimate')
				}
			})
		}
		this.renderEstimate = this.renderEstimate.bind(this)
	}

	update({ estimate }){
		const { props } = this
		props.gasEstimate = estimate
		return true
	}

	renderEstimate(estimate) {
		return estimate
			? html `
				<span class="${styles.postheader} deployEstimate-postheader">
					${utils.roundDecimal(estimate, 1000).toLocaleString()} eth
				</span>`
			: html `
				<div class="${styles.spinnerHolder} deployEstimate-spinnerHolder">
					<div class="spinner-small-teal ${styles.spinnerHolder}"></div>
				</div>
			`
	}

	createElement({ estimate = null }) {
		const { children, renderEstimate } = this
		return html`
		<div class="${styles.container} deployEstimate-container">
      <div>
        <div class="${styles.messageBold} ${styles.bottomMargin} deployEstimate-messageBold/bottomMargin">
          Start Publishing?
        </div>
        <div class="${styles.verticalContainer} deployEstimate-verticalContainer">
          <div class="${styles.smallMessage({})} deployEstimate-smallMessage">
						In order to start the publishing process,<br>
						the File Manager needs to prepare a contract on the network.<br><br>
            This will cost:
					</div>
					<div class=${styles.estimateHolder}>
						${renderEstimate(estimate)}
					</div>
				</div>
			</div>
			<div class="${styles.buttonHolder} deployEstimate-buttonHolder">
      	${children.publishButton.render({ cssClass:
					estimate
						? { opts: { color: 'teal' } }
						: { name: 'thinBorder'}
					})
				}
      	${children.cancelbutton.render({})}
			</div>
    </div>
		`
	}
}

module.exports = DeployEstimate