'use strict'

const Nanocomponent = require('nanocomponent')
const html = require('choo/html')

class TestComponent extends Nanocomponent {
  constructor() {
    super()
  }

  update() {
    return true
  }

  createElement() {
    return html`
      <div>hello this is testCompoent</div>
    `
  }
}

module.exports = TestComponent