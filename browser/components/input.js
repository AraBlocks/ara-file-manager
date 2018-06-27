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

    this.state = {
      cssClass,
      placeholder,
      type
    }
  }

  update() {
    return true
  }

  createElement(chooState) {
    const { state }  = this

    return html`
      <input
        class="${styles[state.cssClass.name || 'standard'](state.cssClass.opts || {})}"
        placeholder=${state.placeholder}
        type=${state.type}
      >
    `
  }
}

module.exports = Input