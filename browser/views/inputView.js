'use strict'

const Nanocomponent = require('nanocomponent')
const html = require('choo/html')
const Input = require('../components/input')

class InputView extends Nanocomponent {
  constructor() {
    super()

    this.input = new Input({
      placeholder: 'Some text'
    })
  }

  update() {
    return true
  }

  createElement(chooState) {
    const { input } = this

    return html`
      <div style="
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
      ">
        ${input.render()}
      </div>`
  }
}

module.exports = InputView