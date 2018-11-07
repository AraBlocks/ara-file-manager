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
    readOnly = false,
    renderView = () => {},
    type = 'text'
  }) {
    super()

    this.props = {
      cssClass,
      embeddedButton,
      field,
      parentState,
      placeholder,
      readOnly,
      renderView,
      type
    }

    this.state = {
      requiredIndicator: false,
      selection: this.props.embeddedButton.optionList ? this.props.embeddedButton.optionList[0] : '',
      value: parentState[field] || ''
    }

    this.onchange = this.onchange.bind(this)
  }

  onchange(e) {
    const { props, state } = this
    state.value = e.target.value
    props.parentState[props.field] = state.value
    props.renderView()
  }

  select(e) {
    const { props, state } = this
    state.selection = e.target.value
    props.parentState[props.embeddedButton.field] = state.selection
  }

  update({ value = null, requiredIndicator = false }) {
    this.state.value = value || this.state.value
    this.state.requiredIndicator = this.state.requiredIndicator !== requiredIndicator
     ? requiredIndicator
     : this.state.requiredIndicator
    return true
  }

  createElement() {
    const {
      onchange,
      props,
      select,
      state
    } = this

    return html`
      <div class="
        ${styles.container} input-container
        ${state.requiredIndicator ? styles.requiredIndicator : null} input-requiredIndicator
        "
      >
        <input
          class="
            ${styles[props.cssClass.name || 'standard'](props.cssClass.opts || {})} input-dynamicClass
            ${state.requiredIndicator ? styles.requiredIndicator : null} input-requiredIndicator
          "
          onchange=${onchange}
          placeholder="${props.placeholder}"
          value="${state.value}"
          type=${props.type}
          ${props.readOnly ? 'readonly' : ''}
        >
        ${generateButton()}
      </div>
    `

    function generateButton() {
      let button = html``
      const embeddedButton = props.embeddedButton
      if (embeddedButton.option === 'button') {
        button = html`
          <button
            class="${styles.button} input-button"
            onclick=${embeddedButton.onclick}
          >
            ${embeddedButton.children}
          </button>`
      } else if (embeddedButton.option === 'selection' && embeddedButton.optionList != null) {
        props.parentState[embeddedButton.field] = embeddedButton.optionList[0]
        button = html`
          <select class="${styles.selection} input-selection" onchange=${select}>
            ${embeddedButton.optionList.map(option => html`<option value=${option}>${option}</option>`)}
          </select>
        `
      }
      return button
    }
  }
}

module.exports = Input