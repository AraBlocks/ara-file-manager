'use strict'

const Button = require('../components/button')
const { closeWindow, emit } = require('../lib/tools/windowManagement')
const k = require('../../lib/constants/stateManagement')
const styles = require('./styles/purchaseEstimate')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')
const { utils } = require('../lib/tools')

class purchaseEstimate extends Nanocomponent {
	constructor(opts) {
    super()
    this.props = { gasEstimate: null, ...opts }

		this.children = {
			buyButton: new Button({
        children: 'Buy Now',
        cssClass: { name: 'thinBorder' }
      }),
			cancelbutton: new Button({
				...styles.buttonSelector('cancel', { height: '1em' }),
				onclick: () => closeWindow('purchaseEstimate')
			})
		}
    this.renderEstimate = this.renderEstimate.bind(this)
    this.purchase = this.purchase.bind(this)
  }

  purchase() {
    const { props } = this
    emit({ event: k.CONFIRM_PURCHASE, load: props })
    closeWindow('purchaseEstimate')
  }

	renderEstimate() {
    const { props } = this

    const fee = utils.roundDecimal(props.price / 10, 10)
		return props.gasEstimate
      ? html`
        <div class="${styles.contentHolder} estimate-contentHolder" style="animation: fadein 1500ms;">
          <div>
            <div>
              <span class="${styles.bigBold} modals-bigBold">
                ${props.price ? props.price + fee : 0}
              </span>
              Ara
            </div>
            <div style="font-size: 9px; ${props.price ? null : 'visibility: hidden;'}">
              ${props.price + ' + ' + fee + ' Network Fee'}
            </div>
            <span class="${styles.bigBold} modals-bigBold">
              ${props.gasEstimate}
            </span>
              Eth
            <div style="font-size: 9px;">
              Gas fee
            </div>
          </div>
        </div>
      `
			: html `
				<div class="${styles.contentHolder} estimate-contentHolder">
					<div class="spinner-small-teal ${styles.spinner}"></div>
				</div>
			`
  }

  update(newProps){
		Object.assign(this.props, newProps)
		return true
	}

	createElement() {
    const {
      children,
      purchase,
      props,
      renderEstimate
    } = this

    return html`
      <div class="${styles.container} modals-container">
        <div>
          <div class="${styles.headerHolder} estimate-headerHolder">
            <div class="${styles.preheader} modals-preheader">
              You're about to purchase
            </div>
            <div class="${styles.fileName} modal-fileName">
              ${props.fileName || props.did.slice(0, 15) + '...'}
            </div>
            <div class="${styles.postheader} modal-postheader">
              from ${props.publisherName || 'Unnamed author'}
            </div>
            <div class="${styles.for} modal-for">
              for
            </div>
          </div>
          ${renderEstimate()}
        <div class="${styles.buttonHolder} purchaseEstimate-buttonholder">
          ${children.buyButton.render({
            cssClass: { name: props.gasEstimate ? 'standard' : 'thinBorder' },
            onclick: props.gasEstimate ? purchase : () => {}
          })}
          ${children.cancelbutton.render({})}
        </div>
      </div>
    `
	}
}

module.exports = purchaseEstimate