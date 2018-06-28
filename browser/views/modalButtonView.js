'use strict'

const Nanocomponent = require('nanocomponent')
const html = require('choo/html')
const ModalButton = require('../components/modalButton')

class ModalButtonView extends Nanocomponent {
  constructor() {
    super()

    this.buyButton = new ModalButton({
      children: 'Buy Now',
      cssClass: { name: 'standard' }
    })

    this.createButton = new ModalButton({
      children: 'Create One',
      cssClass: { name: 'smallInvisible' }
    })

    this.cancelButton = new ModalButton({
      children: 'Cancel',
      cssClass: {
        name: 'smallInvisible',
        opts: {
          color: 'blue',
          weight: 'light'
        }
      }
    })
  }

  update() {
    return true
  }

  createElement() {
    const {
      buyButton,
      createButton,
      cancelButton
     } = this

    return html`
      <div style="
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
      ">
        ${buyButton.render()}
        <br>
        ${createButton.render()}
        <br>
        ${cancelButton.render()}
        <br>
      </div>
    `
  }
}

module.exports = ModalButtonView