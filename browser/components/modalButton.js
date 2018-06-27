'use strict'

const styles = require('./styles/modalButton')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')
const { css } = require('../lib/cssTool/css')

class ModalButton extends Nanocomponent {
  constructor({
    onclick = () => {},
    onmouseover = () => {},
    onmouseout = () => {},
    children = '',
    className = '',
  }) {
    super()

    this.state = {
      onclick,
      onmouseover,
      onmouseout,
      children,
      className
    }
  }

  update() {
    return true
  }

  createElement(chooState) {
    const { state } = this

    return html`
      <button
        class="${styles[state.className]}"
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