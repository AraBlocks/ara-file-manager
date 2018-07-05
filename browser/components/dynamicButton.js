'use strict'

const styles = require('./styles/button')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class DynamicButton extends Nanocomponent {
  constructor({
    children = '',
    onclick = null,
    cssClass = {},
    onmouseout = null,
    onmouseover = null,
    type = ''
  }) {
    super()

    this.state = {
      children,
      onclick,
      cssClass,
      onmouseout,
      onmouseover,
      type
    }
  }

  update(){
    Object.assign(this.state, arguments[0])
    return true
  }

  createElement() {
    const { state } = this

    return html`
      <button
        class="${styles[state.cssClass.name || 'standard'](state.cssClass.opts || {})}"
        onclick=${state.onclick}
        onmouseover=${state.onmouseover}
        onmouseout=${state.onmouseout}
        type=${state.type}
      >
        ${state.children}
      </button>
    `
  }
}

module.exports = DynamicButton