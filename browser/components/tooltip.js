'use strict'

const styles = require('./styles/tooltip')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class Tooltip extends Nanocomponent {
  constructor({
    args,
    component,
    icon = '?',
    id,
    opts = {}
  }) {
    super()

    this.props = {
      args,
      component,
      icon,
      id,
      opts
    }
  }

  update(){
    return true
  }

  createElement() {
    const { props } = this
    return html`
      <div
        class="${styles.container(props.opts)}
        tooltip-container"
        data-tooltip-id=${props.id}
        data-tooltip-component=${props.component}
        data-tooltip-args=${JSON.stringify(props.args)}
      >
        ${props.icon}
      </div>
    `
  }
}

module.exports = Tooltip