'use strict'

const styles = require('./styles/input')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class Input extends Nanocomponent {
  constructor({
    cssClass = {},
    field = '',
    parentState = {},
    placeholder = '',
    type = 'text'
  }) {
    super()

    this.props = {
      cssClass,
      field,
      parentState,
      placeholder,
      type
    }

    this.state = {
      value: ''
    }
  }

  update() {
    return true
  }

  createElement(chooState) {
    const { props, state }  = this

    return html`
      <input
        class="${styles[props.cssClass.name || 'standard'](props.cssClass.opts || {})}"
        onchange=${onchange}
        placeholder=${props.placeholder}
        type=${props.type}
      >
    `

    function onchange(e) {
      console.log(state)
      state.value = e.target.value
      props.parentState[props.field] = state.value
    }
  }

}

module.exports = Input