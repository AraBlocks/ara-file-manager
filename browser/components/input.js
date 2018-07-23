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
      type
    }

    this.state = {
      value: parentState[field] || '',
      selection: this.props.embeddedButton.optionList ? this.props.embeddedButton.optionList[0] : ''
    }

    this.onchange = this.onchange.bind(this)
  }

  update({ value, selection }) {
    const { state } = this
    const sameValue = state.value === value && state.selection === selection
    if (!sameValue) {
      state.value = state.value === value ? state.value : value
      state.selection = state.selection === selection ? state.selection : selection
    }
    return !sameValue
  }

  onchange(e) {
    const { props, state } = this
    state.value = e.target.value
    props.parentState[props.field] = state.value
  }

  select(e) {
    const { props, state } = this
    state.selection = e.target.value
    props.parentState[props.embeddedButton.field] = state.selection
  }

  createElement() {
    const {
      onchange,
      props,
      select,
      state
    } = this
    return html`
      <div class="${styles.container}">
        <input
          class="${styles[props.cssClass.name || 'standard'](props.cssClass.opts || {})} input-dynamicClass"
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
            class=${styles.button}
            onclick=${embeddedButton.onclick}
          >
            ${embeddedButton.children}
          </button>`
      } else if (embeddedButton.option === 'selection' && embeddedButton.optionList != null) {
        props.parentState[embeddedButton.field] = embeddedButton.optionList[0]
        button = html`
          <select class=${styles.selection} onchange=${select}>
            ${embeddedButton.optionList.map(option => html`<option value=${option}>${option}</option>`)}
          </select>
        `
      }
      return button
    }
  }
}

module.exports = Input