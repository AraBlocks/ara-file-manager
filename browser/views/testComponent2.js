'use strict'

const Nanocomponent = require('nanocomponent')
const html = require('choo/html')

class TestComponent2 extends Nanocomponent {
  constructor() {
    super()
  }

  update() {
    return true
  }

  createElement() {
    return html`
      <div>hello this is testComponent2</div>
    `
  }
}

module.exports = TestComponent2