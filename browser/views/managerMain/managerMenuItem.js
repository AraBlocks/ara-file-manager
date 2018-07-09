'use strict'

const Nanocomponent = require('nanocomponent')
const html = require('choo/html')
const styles = require('./styles/managerMenuItem')

class ManagerMenuItem extends Nanocomponent {
  constructor({ 
    children = "",
    onclick = () => {}
  }) {
    super()
    this.props = {
      children,
      onclick
    }
  }

  update() {
    return true
  }

  createElement() {
    const { props } = this

    return html`
      <div 
        class="${styles.container} ManagerMenuItem-container"
        onclick=${props.onclick}
      >
        ${props.children}
      </div>
    `
  }
}

module.exports = ManagerMenuItem