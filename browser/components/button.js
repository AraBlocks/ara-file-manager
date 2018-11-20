'use strict'

const styles = require('./styles/button')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class Button extends Nanocomponent {
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

  update({ cssClass, children }) {
    const { props } = this
    props.cssClass = cssClass ? cssClass : props.cssClass
    props.children = children ? children : props.children
    return true
  }

  createElement() {
    const { props } = this
    console.log(props.children)
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

module.exports = Button