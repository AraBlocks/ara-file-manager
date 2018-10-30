'use strict'

const Button = require('../components/button')
const Input = require('../components/input')
const styles = require('./styles/import')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class className extends Nanocomponent {
  constructor() {
    super()
    this.state = {
      mnemonic: '',
      password: '',
    }
    //TODO: grey out button if incomplete
    this.children = {
      passwordInput: new Input({
        placeholder: 'Password',
        parentState: this.state,
        field: 'password',
        type: 'password'
      }),

      submitButton: new Button({
        children: 'Import Account',
        onclick: () => console.log('importing')
      }),
    }
  }

  update() {
    return true
  }

  import() {

  }

  createElement() {
    const { children } = this
    return html`
      <div class="${styles.container} import-container">
        <div>Import Account</div>
        <div>To load your account onto this computer, please paste the 12 word mnemonic you were given when this account was created</div>
        <div>You will have to set a new password. This password is <b>specific to this computer</b></div>
        <textarea class="${styles.textinputMnemonic} mnemonic-textinputMnemonic"></textarea>
        ${children.passwordInput.render({})}
        ${children.submitButton.render({})}
      </div>
    `
  }
}

module.exports = className