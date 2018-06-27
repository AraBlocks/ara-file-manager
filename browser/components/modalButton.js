'use strict'

const styles = require('./styles/modalButton')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class ModalButton extends Nanocomponent {
  constructor({
    children = '',
    onclick = () => {},
    cssClass = {},
    onmouseout = () => {},
    onmouseover = () => {},
  }) {
    super()
    this.state = {
      children,
      onclick,
      cssClass,
      onmouseout,
      onmouseover
    }
  }

  update() {
    return true
  }

  createElement(chooState) {
    const { state } = this

    return html`
      <button
        class="${styles[state.cssClass.name || 'standard'](state.cssClass.opts || {})}"
        onclick=${state.onclick}
        onmouseover=${state.onmouseover}
        onmouseout=${state.onmouseout}
      >
        ${state.children}
      </button>
    `
  }
}

module.exports = ModalButton