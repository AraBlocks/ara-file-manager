'use strict'

const styles = require('./styles/tooltip')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class Tooltip extends Nanocomponent {
  constructor({
    opts = {},
    icon = '?',
    tooltipText = ''
  }) {
    super()

    this.props = {
      opts,
      icon,
      tooltipText
    }
  }

  update(){
    return true
  }

  createElement() {
    const { props } = this
    return html`
      <div class="${styles.container(props.opts)} container">
        ${props.icon}
        <div class="${styles.textHolder(props.opts)} textHolder">
          ${props.tooltipText}
        </div>
      </div>
    `
  }
}

module.exports = Tooltip