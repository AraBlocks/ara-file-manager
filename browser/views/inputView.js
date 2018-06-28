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

    window.inputView = this
  }

  update() {
    return true
  }

  createElement(chooState) {
    const { input } = this

    return html`
      <div class="popup">
        ${input.render()}
      </div>`
  }
}

module.exports = InputView