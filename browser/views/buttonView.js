'use strict'

const Nanocomponent = require('nanocomponent')
const html = require('choo/html')
const Button = require('../components/button')

class ButtonView extends Nanocomponent {
  constructor() {
    super()

    this.buyButton = new Button({
      children: 'Buy Now',
      cssClass: { name: 'standard' }
    })

    this.createButton = new Button({
      children: 'Create One',
      cssClass: { name: 'smallInvisible' }
    })

    this.cancelButton = new Button({
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

module.exports = ButtonView