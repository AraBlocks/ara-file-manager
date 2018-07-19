'use strict'

const styles = require('./styles/input')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class Input extends Nanocomponent {
  constructor({
    cssClass = {},
    embeddedButton = {},
    field = '',
    parentState = {},
    placeholder = '',
    type = 'text'
  }) {
    super()

    this.props = {
      cssClass,
      embeddedButton,
      field,
      parentState,
      placeholder,
      type
    }

    this.state = {
      value: '',
      selection: this.props.embeddedButton.optionList ? this.props.embeddedButton.optionList[0] : ''
    }
  }

  update({ value, selection = '' }) {
    const { state } = this
    const sameValue = this.state.value === value && this.state.selection === selection
    if (!sameValue) {
      state.value = value
      state.selection = selection
    }
    return !sameValue
  }

  createElement(chooState) {
    const { props, state }  = this
    return html`
      <div class="${styles.container}">
        <input
          class="${styles[props.cssClass.name || 'standard'](props.cssClass.opts || {})}"
          onchange=${onchange}
          placeholder=${props.placeholder}
          value=${state.value}
          type=${props.type}
        >
        ${generateButton()}
      </div>
    `

    function onchange(e) {
      state.value = e.target.value
      props.parentState[props.field] = state.value
    }

    function generateButton() {
      let button = html``
      const embeddedButton = props.embeddedButton
      if (embeddedButton.option === 'button') {
        button = html`
          <button
            class=${styles.button}
            onclick=${embeddedButton.onclick}
          >
            ${embeddedButton.children}
          </button>`
      } else if (embeddedButton.option === 'selection' && embeddedButton.optionList != null) {
        props.parentState[embeddedButton.field] = embeddedButton.optionList[0]
        button = html`
          <select class=${styles.selection} onchange=${currencyChanged}>
            ${embeddedButton.optionList.map(currency => html`<option value=${currency}>${currency}</option>`)}
          </select>
        `
      }
      return button

      function currencyChanged(e) {
        state.selection = e.target.value
        props.parentState[embeddedButton.field] = state.selection
      }
    }
  }
}

module.exports = Input