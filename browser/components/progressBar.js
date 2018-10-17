'use strict'

const styles = require('./styles/progressBar')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class className extends Nanocomponent {
  constructor() {
    super()
    this.props = {}
  }

  update(){
    return true
  }

  createElement() {
    const { props } = this
    return html`
      <div class="${styles.holder} progressBar-holder">
        <div class="${styles.progress} progressBar-progress"></div>
      </div>
    `
  }
}

module.exports = className