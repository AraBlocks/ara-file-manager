'use strict'

const Button = require('../components/button')
const { closeModal, closeWindow, emit } = require('../lib/tools/windowManagement')
const k = require('../../lib/constants/stateManagement')
const { utils } = require('../lib/tools')
const styles = require('./styles/deployEstimateView')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class DeployEstimate extends Nanocomponent {
	constructor() {
		super()
		this.props = {
			did: null
		}
		this.children = {
			publishButton: new Button({
				children: 'Confirm',
				cssClass: { name: 'thinBorder' },
				onclick: () => {
					if (this.props.did) {
						emit({ event: k.CONFIRM_DEPLOY_PROXY, load: { did: this.props.did } }),
						closeModal()
					}
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

	update({ did }){
		const { props } = this
		props.did = did
		return true
	}

	renderEstimate(estimate) {
		let estimateText = html``
		estimate
			? estimateText = html `
				<span class="${styles.postheader} deployEstimateView-postheader">
					${utils.roundDecimal(estimate, 1000)} eth
				</span>`
			: estimateText = html `
				<div class="${styles.spinnerHolder} deployEstimateView-spinnerHolder">
					<div class="spinner-small-red ${styles.spinnerHolder}"></div>
				</div>
			`
		return estimateText
	}

	createElement({ estimate = null }) {
		const { children, renderEstimate } = this
		return html`
		<div class="${styles.container} deployEstimateView-container">
      <div>
        <div class="${styles.messageBold} ${styles.bottomMargin} deployEstimateView-messageBold/bottomMargin">
          Start Publishing?
        </div>
        <div class="${styles.verticalContainer} deployEstimateView-verticalContainer">
          <div class="${styles.smallMessage({})} deployEstimateView-smallMessage">
						In order to start the publishing process,<br>
						the File Manager needs to prepare the network.<br><br>
            This will cost:
					</div>
					<div class=${styles.estimateHolder}>
						${renderEstimate(estimate)}
					</div>
				</div>
			</div>
			<div class="${styles.buttonHolder} deployEstimateView-buttonHolder">
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