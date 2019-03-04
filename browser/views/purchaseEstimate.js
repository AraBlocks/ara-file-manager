const html = require('nanohtml')
const { events } = require('k')
const Nanocomponent = require('nanocomponent')

const Button = require('../components/button')
const { closeWindow, emit } = require('../lib/tools/windowManagement')
const styles = require('./styles/purchaseEstimate')
const { utils } = require('../lib/tools')

class PurchaseEstimate extends Nanocomponent {
	constructor(opts) {
    super()
    this.props = { gasEstimate: null, ...opts }

		this.children = {
			buyButton: new Button({
        children: 'Buy Now',
        cssClass: { name: 'thinBorder' }
      }),
			cancelbutton: new Button({
				...styles.buttonSelector('cancel'),
				onclick: () => closeWindow('purchaseEstimate')
			})
		}
    this.renderEstimate = this.renderEstimate.bind(this)
    this.purchase = this.purchase.bind(this)
  }

  purchase() {
    const { props } = this
    emit({ event: events.CONFIRM_PURCHASE, load: props })
    closeWindow('purchaseEstimate')
  }

	renderEstimate() {
    const { props } = this
		return props.gasEstimate
      ? (html`
        <div class="${styles.contentHolder} estimate-contentHolder" style="animation: fadein 1500ms;">
          <div>
            <div class="${styles.padding}">
              <span class="${styles.bigBold} modals-bigBold">
                ${props.price ? props.price + utils.roundDecimal(props.fee, 1000) : 0}
              </span>
                Ara
              <div style="font-size: 9px; ${props.price ? null : 'visibility: hidden;'}">
                ${props.price + ' + ' + utils.roundDecimal(props.fee, 1000) + ' Network Fee'}
              </div>
            </div>
            <div class="${styles.padding}">
              <span class="${styles.bigBold} modals-bigBold">
                ${utils.roundDecimal(props.gasEstimate, 1000)}
              </span>
                Eth
              <div style="font-size: 9px;">
                Gas fee
              </div>
            </div>
            ${props.peers
              ? null
              : (html`
                <div class="${styles.padding}">
                  There are no peers online right now.
                  <div style="padding-top: 3px">
                    This may not download immediately.
                  </div>
                </div>`
              )
            }
          </div>
        </div>
      `)
			: (html `
				<div class="${styles.contentHolder} estimate-contentHolder">
					<div class="spinner-small-teal ${styles.spinner}"></div>
				</div>
			`)
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

    return (html`
      <div class="${styles.container} modals-container">
        <div class="${styles.headerHolder} estimate-headerHolder">
          <div class="${styles.preheader} modals-preheader">
            You're about to purchase
          </div>
          <div class="${styles.fileName} modal-fileName">
            ${props.fileName || did.slice(0, 15) + '...'}
          </div>
          ${props.author
          ? (html`
              <div class="${styles.postheader} modal-postheader">
                from ${props.author || 'Unnamed author'}
              </div>`
            )
          : null}
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
    `)
	}
}

module.exports = PurchaseEstimate
