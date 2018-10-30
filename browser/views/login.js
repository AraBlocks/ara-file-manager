'use strict'

const {
  closeWindow,
  transitionModal,
} = require('../lib/tools/windowManagement')
const Button = require('../components/button')
const Input = require('../components/input')
const { LOGIN } = require('../../lib/constants/stateManagement')
const styles = require('./styles/login')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')
const { emit, openWindow } = require('../../browser/lib/tools/windowManagement')

class Login extends Nanocomponent {
  constructor() {
    super()

    this.state = {
      passwordValue: '',
      usernameValue: ''
    }

    this.children = {
      cancelButton: new Button({
        children: 'Cancel',
        cssClass: {
          name: 'smallInvisible',
          opts: {
            color: 'blue',
            weight: 'light'
          }
        },
        onclick: () => closeWindow()
      }),

      loginButton: new Button({
        children: 'Log In'
      }),

      registerButton: new Button({
        children: 'Create One',
        cssClass: { name: 'smallInvisible' },
        onclick: () => transitionModal('registration')
      }),

      passwordInput: new Input({
        parentState: this.state,
        field: 'passwordValue',
        placeholder: 'Password',
        type: 'password'
      }),

      usernameInput: new Input({
        parentState: this.state,
        field: 'usernameValue',
        placeholder: 'Username'
      }),
    }

    this.login = this.login.bind(this)
  }

  login(e) {
    e.preventDefault()
    const { usernameValue, passwordValue } = this.state
    const load = { password: passwordValue, userAid: usernameValue }
    emit({ event: LOGIN, load })
    closeWindow('login')
  }

  update() {
    return true
  }

  createElement() {
    const { children, login } = this
    return html`
      <div class="${styles.container} login-container">
        <div class="${styles.logo} login-logo">
          LTLSTAR
        </div>
        <div class="${styles.title} login-title">
          Log In
        </div>
        <p class="${styles.descriptionHolder} login-descriptionHolder">
          Welcome to the <b>Littlstar Media Manager</b>. Use this
          app to buy, sell, share, and earn rewards for files on
          the ARA Network across the web.
          <br><br>
          To get started, log in with your <b>ARA id</b>
        </p>
        <form class="${styles.form} login-form" onsubmit=${login}>
          ${children.usernameInput.render()}
          ${children.passwordInput.render()}
          ${children.loginButton.render()}
        </form>
        <div class="${styles.buttonHolder} login-buttonHolder">
          <b>Don't have an account?</b>
          ${children.registerButton.render()}
          ${children.cancelButton.render()}
        </div>
      </div>
    `
  }
}

module.exports = Login