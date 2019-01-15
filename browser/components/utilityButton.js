'use strict'

const styles = require('./styles/utilityButton')
const windowManagement = require('../lib/tools/windowManagement')
const html = require('nanohtml')
const Nanocomponent = require('nanocomponent')

const DEFAULT_CALLBACK = () => windowManagement.closeWindow()

class UtilityButton extends Nanocomponent {
  constructor({ children = 'close', onclick = DEFAULT_CALLBACK }) {
    super()

    this.props = { onclick }
    this.state = { children }
  }

  update({ children }) {
    let sameState = this.state.children === children
    if (!sameState) {
      this.state.children = children
    }
    return !sameState
  }

  renderButtonIcon() {
    const { state } = this
    let iconName = ''
    let yTransform = 1
    switch (state.children) {
      case 'close':
        iconName ='Close'
        break
      case 'upArrow':
        iconName = 'Arrow'
        break
      case 'downArrow':
        iconName = 'Arrow'
        yTransform = -1
        break
      case 'minimize':
        iconName = 'Minimize'
        break
      default:
    }
    return iconName == ''
      ? state.children
      : html`<img
        class="${styles.iconHolder(yTransform)} header-iconHolder"
        src="../assets/images/utilityButtons/${iconName}.svg"
      />`
  }

  createElement() {
    const { props } = this

    return html`
      <div onclick=${props.onclick} class=${styles.standard}>
        ${this.renderButtonIcon()}
      </div>
    `
  }
}

module.exports = UtilityButton