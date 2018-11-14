'use strict'

const k = require('../../lib/constants/stateManagement')
const Button = require('../components/button')
const Input = require('../components/input')
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

      mnemonicInput: new Input({
        placeholder: 'Mnemonic',
        parentState: this.state,
        field: 'mnemonic',
        type: 'password'
      }),

      passwordInput: new Input({
        placeholder: 'Password',
        parentState: this.state,
        field: 'password',
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
    const { password, mnemonic } = this.state
    if (mnemonic.split(' ').length !== 12) { return }
    windowManagement.emit({ event: k.RECOVER , load: { password, mnemonic } })
  }

  update() {
    return true
  }

  createElement({ pending = false }) {
    const { children } = this
    return html`
      <div class="${styles.container} recover-container">
        ${overlay(pending)}
        <div class="${styles.logo} login-logo">
          <img src="../assets/images/ARA_logo_horizontal.png"/>
        </div>
        <div class="${styles.title} login-title">
          Recover
        </div>
        <form class="${styles.recoverForm} recover-recoverForm" onsubmit=${this.recover}>
          <div>To recover your Ara ID, please input your unique <b>mnemonic</b> code.</div>
          ${children.mnemonicInput.render({})}
          <div>Please create a new <b>password</b> for you Ara ID</div>
          ${children.passwordInput.render({})}
          ${children.submitButton.render({})}
          ${children.cancelButton.render({})}
        </form>
      </div>
    `
  }
}

module.exports = Recover