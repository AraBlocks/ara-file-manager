'use strict'

const Button = require('../components/button')
const { closeWindow, emit } = require('../lib/tools/windowManagement')
const styles = require('./styles/redeemEstimate')
const html = require('nanohtml')
const Nanocomponent = require('nanocomponent')
const { utils } = require('../lib/tools')

class RedeemEstimate extends Nanocomponent {
  constructor(opts) {
    super()
    this.props = { estimate: null, ...opts }

    this.children = {
      confirmButton: new Button({
        children: opts.confirmText,
        cssClass: { name: 'thinBorder' },
        onclick: this.confirm.bind(this)
      }),
			cancelbutton: new Button({
				...styles.buttonSelector('cancel'),
				onclick: () => closeWindow('redeemEstimate')
			})
    }

    this.renderEstimate = this.renderEstimate.bind(this)
    this.confirm = this.confirm.bind(this)
  }

  confirm() {
    const { props } = this
    if(props.estimate) {
      emit({ event: props.confirmEvent, load: props })
      closeWindow('redeemEstimate')
    }
  }

  renderEstimate() {
    return this.props.estimate
      ? html`
        <div>
          <div class="${styles.spinnerText} redeemEstimate-spinnerText">This will cost:</div>
          <span class="${styles.postheader} redeemEstimate-postheader" style="animation: fadein 1500ms;">
            ${utils.roundDecimal(this.props.estimate, 1000).toLocaleString()} eth
          </span>
        </div>
      `
      : html`
        <div>
          <div class="${styles.spinnerText} redeemEstimate-spinnerText">This will cost:</div>
          <div class="${styles.spinnerHolder} redeemEstimate-spinnerHolder">
            <div class="spinner-small-teal ${styles.spinnerHolder}"></div>
          </div>
        </div>
			`
  }

  get confirmButtonStyle() {
    return {
      cssClass: this.props.estimate
        ? { opts: { color: 'teal' } }
        : { name: 'thinBorder' }
    }
  }

  update(newProps) {
    Object.assign(this.props, newProps)
    return true
  }

  createElement() {
    const {
      children,
      renderEstimate,
      props,
      confirmButtonStyle
    } = this
    return html`
      <div class=${styles.container} redeemEstimate-container>
        <div>
          <div class="${styles.messageBold} ${styles.bottomMargin} redeemEstimate-messageBold/bottomMargin">
            ${props.header}
          </div>
          <div class="${styles.verticalContainer} redeemEstimate-verticalContainer">
            <div class="${styles.smallMessage()} redeemEstimate-smallMessage">
              ${props.smallMessageText}
            </div>
            <div class=${styles.estimateHolder}>
              ${renderEstimate()}
            </div>
          </div>
        </div>
        <div class="${styles.buttonHolder} redeemEstimate-buttonHolder">
          ${children.confirmButton.render(confirmButtonStyle)}
          ${children.cancelbutton.render({})}
        </div>
      </div>
		`
  }
}

module.exports = RedeemEstimate