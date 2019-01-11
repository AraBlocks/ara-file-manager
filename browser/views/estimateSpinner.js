'use strict'

const Button = require('../components/button')
const { closeWindow, emit } = require('../lib/tools/windowManagement')
const styles = require('./styles/estimateSpinner')
const html = require('nanohtml')
const Nanocomponent = require('nanocomponent')
const { utils } = require('../lib/tools')

class EstimateSpinner extends Nanocomponent {
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
				onclick: () => closeWindow('estimateSpinner')
			})
    }

    this.renderEstimate = this.renderEstimate.bind(this)
  }

  confirm() {
    const { props } = this
    if(props.estimate) {
      emit({ event: props.confirmEvent, load: props })
      closeWindow('estimateSpinner')
    }
  }

  renderEstimate() {
    return this.props.estimate
      ? html`
        <div>
          <div class="${styles.spinnerText} EstimateSpinner-spinnerText">This will cost:</div>
          <span class="${styles.postheader} EstimateSpinner-postheader" style="animation: fadein 1500ms;">
            ${utils.roundDecimal(this.props.estimate, 1000).toLocaleString()} eth
          </span>
        </div>
      `
      : html`
        <div>
          <div class="${styles.spinnerText} EstimateSpinner-spinnerText">This will cost:</div>
          <div class="${styles.spinnerHolder} EstimateSpinner-spinnerHolder">
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
      <div class="${styles.container} EstimateSpinner-container">
        <div class="${styles.topContainer} estimateSpinner-topContainer">
          <div class="${styles.messageBold} ${styles.bottomMargin} EstimateSpinner-messageBold/bottomMargin">
            ${props.header}
          </div>
          <div class="${styles.verticalContainer} EstimateSpinner-verticalContainer">
            <div class="${styles.smallMessage()} EstimateSpinner-smallMessage">
              ${props.smallMessageText}
            </div>
            <div class=${styles.estimateHolder}>
              ${renderEstimate()}
            </div>
          </div>
        </div>
        <div class="${styles.buttonHolder} EstimateSpinner-buttonHolder">
          ${children.confirmButton.render(confirmButtonStyle)}
          ${children.cancelbutton.render({})}
        </div>
      </div>
		`
  }
}

module.exports = EstimateSpinner