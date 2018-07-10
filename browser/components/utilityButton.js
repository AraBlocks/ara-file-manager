'use strict'

const styles = require('./styles/utilityButton')
const windowManagement = require('../lib/store/windowManagement')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class UtilityButton extends Nanocomponent {
  constructor({
    children = '✕',
    onclick = () => { windowManagement.closeWindow() }
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
      <button onclick=${props.onclick} class=${styles.standard}>
        ${props.children}
      </button>
    `
  }
}

module.exports = UtilityButton