'use strict'

const Nanocomponent = require('nanocomponent')
const html = require('choo/html')
const ModalButton = require('../components/modalButton')
const { css } = require('../lib/cssTool/css')

class TestComponent extends Nanocomponent {
  constructor() {
    super()

    this.modalButton = new ModalButton({
      children: 'Buy Now',
      className: 'standard'
    })
  }

  update() {
    return true
  }

  createElement() {
    const { modalButton } = this
    return html`
      <div style="
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
      ">
        ${modalButton.render()}
      </div>
    `
  }
}

module.exports = TestComponent