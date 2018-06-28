'use strict'

const styles = require('./styles/input')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class Input extends Nanocomponent {
  constructor({
    cssClass = {},
    placeholder = '',
    type = 'text'
  }) {
    super()

    this.props = {
      cssClass,
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
        onchange=${e => state.value = e.target.value}
        placeholder=${props.placeholder}
        type=${props.type}
      >
    `
  }

}

module.exports = Input