'use strict'

const k = require('../../lib/constants/stateManagement')
const Button = require('../components/button')
const Input = require('../components/input')
const overlay = require('../components/overlay')
const styles = require('./styles/import')
const windowManagement = require('../../browser/lib/tools/windowManagement')
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
        placeholder: 'New Password',
        parentState: this.state,
        field: 'password',
        type: 'password'
      }),

      submitButton: new Button({
        children: 'Import Account',
        onclick: this.import.bind(this)
      }),
    }
  }

  import() {
    const { password, mnemonic } = this.state
    if (mnemonic.split(' ').length !== 12) { return }
    windowManagement.emit({ event: k.IMPORT , load: { password, mnemonic } })
  }

  update() {
    return true
  }

  createElement({ pending = false }) {
    const { children, state } = this
    window.importComponent = this
    return html`
      <div class="${styles.container} import-container">
        ${overlay(pending)}
        <div>Import Account</div>
        <div>To load your account onto this computer, please paste the 12 word mnemonic you were given when this account was created</div>
        <div>You will have to set a new password (it <b>can</b> be the same). This password is <b>specific to this computer</b></div>
        <textarea
          class="${styles.textinputMnemonic} mnemonic-textinputMnemonic"
          onchange="${e => state.mnemonic = e.target.value}"
        ></textarea>
        ${children.passwordInput.render({})}
        ${children.submitButton.render({})}
      </div>
    `
  }
}

module.exports = className