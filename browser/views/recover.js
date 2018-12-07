'use strict'

const k = require('../../lib/constants/stateManagement')
const Button = require('../components/button')
const ErrorInput = require('../components/errorInput')
const overlay = require('../components/overlay')
const styles = require('./styles/recover')
const windowManagement = require('../lib/tools/windowManagement')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class Recover extends Nanocomponent {
  constructor() {
    super()
    this.state = {
      mnemonic: '',
      password: '',
      confirmPassword: ''
    }
    //TODO: grey out button if incomplete
    this.children = {
      cancelButton: new Button({
        children: 'Cancel',
        cssClass: {
          name: 'smallInvisible',
          opts: {
            color: 'orange',
            weight: 'light'
          }
        },
        onclick: () => windowManagement.closeWindow()
      }),

      mnemonicInput: new ErrorInput({
        errorMessage: 'Mnemonic must be 12 words with spaces in between',
        placeholder: 'Mnemonic',
        parentState: this.state,
        field: 'mnemonic',
        type: 'password'
      }),

      passwordInput: new ErrorInput({
        errorMessage: 'Password must not be left blank',
        placeholder: 'Password',
        parentState: this.state,
        field: 'password',
        type: 'password'
      }),

      confirmPasswordInput: new ErrorInput({
        errorMessage: 'Must Confirm Password',
        placeholder: 'Confirm Password',
        parentState: this.state,
        field: 'confirmPassword',
        type: 'password'
      }),

      submitButton: new Button({
        children: 'Recover',
        onclick: this.recover.bind(this)
      })
    }
  }

  recover(e) {
    e.preventDefault()
    const { password, mnemonic, confirmPassword } = this.state

    const flagMnemonicField = mnemonic.split(' ').length !== 12
    const flagPWField = password === ''
    const flagConfirmPWField = confirmPassword === '' || password !==  confirmPassword
    flagMnemonicField || flagPWField || flagConfirmPWField
      ? this.render({ flagMnemonicField, flagPWField, flagConfirmPWField })
      : windowManagement.emit({ event: k.RECOVER, load: { password, mnemonic } })
  }

  update() {
    return true
  }

  createElement(opts) {
    const { children, state } = this
    const {
      flagMnemonicField = false,
      flagPWField = false,
      flagConfirmPWField = false,
      pending = false
    } = opts

    return html`
      <div class="${styles.container} recover-container">
        ${overlay(pending)}
        <div class="${styles.logo} login-logo">
          <img src="../assets/images/ARA_logo_horizontal.png" />
        </div>
        <div class="${styles.title} login-title">
          Recover
        </div>
        <form class="${styles.recoverForm} recover-recoverForm" onsubmit="${this.recover}">
          <div>To recover your Ara ID, please input your unique <b>mnemonic</b> code.</div>
          ${children.mnemonicInput.render({ displayError: flagMnemonicField })}
          <div>Please create a new <b>password</b> for your Ara ID</div>
          ${children.passwordInput.render({ displayError: flagPWField })}
          ${children.confirmPasswordInput.render({
            displayError: flagConfirmPWField,
            errorMessage: state.confirmPassword === ''
              ? 'Must confirm password'
              : "Passwords don't match"
          })}
          <div>
            ${children.submitButton.render({})}
            ${children.cancelButton.render({})}
          </div>
        </form>
      </div>
    `
  }
}

module.exports = Recover