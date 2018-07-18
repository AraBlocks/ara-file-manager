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
      value: ''
    }
  }

  update({ value }) {
    const { state } = this
    const sameValue = this.state.value === value
    if (!sameValue) {
      state.value = value
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
      if (props.embeddedButton.option === "button") {
        button = html`
          <button
            class=${styles.button}
            onclick=${props.embeddedButton.onclick}
          >
            ${props.embeddedButton.children}
          </button>`
      }
      return button
    }
  }
}

module.exports = Input