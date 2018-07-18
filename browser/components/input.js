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
      converter: this.props.embeddedButton.optionList ? this.props.embeddedButton.optionList[0] : ''
    }
  }

  update({ value, converter = '' }) {
    const { state } = this
    const sameValue = this.state.value === value && this.state.converter === converter
    if (!sameValue) {
      state.value = value
      state.converter = converter
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
      } else if (embeddedButton.option === 'converter' && embeddedButton.optionList != null) {
        button = html`
          <select class=${styles.converter} onchange=${currencyChanged}>
            ${embeddedButton.optionList.map(currency => html`<option value=${currency}>${currency}</option>`)}
          </select>
        `
      }
      return button

      function currencyChanged(e) {
        state.value = e.target.value
        props.parentState[embeddedButton.field] = state.value
      }
    }
  }
}

module.exports = Input