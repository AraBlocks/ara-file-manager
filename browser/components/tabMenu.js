'use strict'

const styles = require('./styles/tabMenu')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class TabMenu extends Nanocomponent {
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
    `
  }
}

module.exports = TabMenu