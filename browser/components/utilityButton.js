'use strict'

const remote = require('electron').remote;
const windowManager = remote.require('electron-window-manager')
const styles = require('./styles/utilityButton')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class UtilityButton extends Nanocomponent {
  constructor({
    type = 'close',
    onclick = () => { close() }
  }) {
    super()

    this.props = {
      type,
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
        ${props.type}  
      </button>
    `
  }
}

module.exports = UtilityButton