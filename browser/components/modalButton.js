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
    type = ''
  }) {
    super()

    this.props = {
      children,
      onclick,
      cssClass,
      onmouseout,
      onmouseover,
      type
    }
  }

  update() {
    return true
  }

  createElement(chooState) {
    const { props } = this

    return html`
      <button
        class="${styles[props.cssClass.name || 'standard'](props.cssClass.opts || {})}"
        onclick=${props.onclick}
        onmouseover=${props.onmouseover}
        onmouseout=${props.onmouseout}
        type=${props.type}
      >
        ${props.children}
      </button>
    `
  }
}

module.exports = ModalButton