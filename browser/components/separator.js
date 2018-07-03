'use strict'

const Nanocomponent = require('nanocomponent')
const html = require('choo/html')
const { colors } = require('../lib/styles')

class Separator extends Nanocomponent {
  constructor() {
    super()
  }

  update() {
    return true
  }

  createElement() {
    return html`
      <div style="
        width: 100%;
        height: 1px;
        background-color: ${colors.araGrey};
      "></div>
    `
  }
}

module.exports = Separator