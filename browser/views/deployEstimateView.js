'use strict'

const styles = require('./styles/deployEstimateView')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

const k = require('../../lib/constants/stateManagement')
const { closeModal, closeWindow, emit } = require('../lib/tools/windowManagement')
const Button = require('../components/button')
const { utils } = require('../lib/tools')

class DeployEstimate extends Nanocomponent {
	constructor() {
		super()
		this.props = {
			gasEstimate: null
		}
		this.children = {
			publishButton: new Button({
				children: 'Confirm',
				onclick: () => {
					emit({ event: k.CONFIRM_DEPLOY_PROXY, load: { ...load } }),
					closeModal()
				}
			}),
			cancelbutton: new Button({
				...styles.buttonSelector('cancel'),
				onclick: () => {
					closeWindow('deployEstimateView')
				}
			})
		}
		this.renderEstimate = this.renderEstimate.bind(this)
	}

	update({ estimate }){
		return true
	}

	renderEstimate(estimate) {
		let estimateText = html``
		estimate
			? estimateText = html `
				<span class="${styles.postheader} modals-postheader">
					${utils.roundDecimal(estimate, 1000)} eth
				</span>`
			: estimateText = html `
				<div class="${styles.spinnerHolder} modal-spinnerHolder">
					<div class="spinner-small-red ${styles.spinnerHolder}"></div>
				</div>
			`
		return estimateText
	}

	createElement({ estimate = null }) {
		const { props, children, renderEstimate } = this 
		return html`
		<div class="${styles.container} modals-container">
      <div>
        <div class="${styles.messageBold} ${styles.bottomMargin} modal-messageBold/bottomMargin">
          Start Publishing?
        </div>
        <div class="${styles.verticalContainer} modal-verticalContainer">
          <div class="${styles.smallMessage({})} modal-smallMessage">
						In order to start the publishing process,<br> 
						the File Manager needs to prepare the network.<br>
            <br>This will cost:
					</div>
					<div class=${styles.estimateHolder}>
						${renderEstimate(estimate)}
					</div>
				</div>
			</div>
			<div class="${styles.buttonHolder} deployEstimateView-buttonHolder">
      	${children.publishButton.render({})}
      	${children.cancelbutton.render({})}
			</div>
    </div>
		`
	}
}

module.exports = DeployEstimate