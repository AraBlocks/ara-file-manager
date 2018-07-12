'use strict'

const styles = require('./styles/utilityButton')
const windowManagement = require('../lib/store/windowManagement')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class UtilityButton extends Nanocomponent {
  constructor({
    children = '✕',
    onclick = windowManagement.closeWindow
  }) {
    super()

    this.props = {
      onclick
    }

    this.state = {
      children
    }
  }

  update({ children }) {
    let sameSate = this.state.children == children
    if (!sameSate) {
      this.state.children = children
    }
    return !sameSate
  }

  createElement() {
    const { props, state } = this

    return html`
      <button onclick=${props.onclick} class=${styles.standard}>
        ${ state.children }
      </button>
    `
  }
}

module.exports = UtilityButton