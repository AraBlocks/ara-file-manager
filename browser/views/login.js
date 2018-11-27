'use strict'

const acmManager = require('../../kernel/lib/actions/acmManager')
const windowManagement = require('../lib/tools/windowManagement')
const Button = require('../components/button')
const Input = require('../components/input')
const { LOGIN } = require('../../lib/constants/stateManagement')
const styles = require('./styles/login')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class Login extends Nanocomponent {
  constructor() {
    super()

    this.state = {
      password: '',
      userDID: acmManager.getCachedUserDid()
    }

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

      loginButton: new Button({
        children: 'Log In'
      }),

      recoverButton: new Button ({
        children: 'Recover',
        cssClass: { name: 'smallInvisible' },
        onclick: () => {
          windowManagement.openWindow('recover')
          windowManagement.closeWindow('login')
        }
      }),

      registerButton: new Button({
        children: 'Create One',
        cssClass: { name: 'smallInvisible' },
        onclick: () => {
          windowManagement.openWindow('registration')
          windowManagement.closeWindow('login')
        }
      }),

      passwordInput: new Input({
        parentState: this.state,
        field: 'password',
        placeholder: 'Password',
        type: 'password'
      }),

      userDIDInput: new Input({
        parentState: this.state,
        field: 'userDID',
        placeholder: 'Ara Identity'
      }),
    }

    this.login = this.login.bind(this)
  }

  login(e) {
    e.preventDefault()
    const { userDID, password } = this.state
    const load = { password, userAid: userDID }
    windowManagement.emit({ event: LOGIN, load })
    windowManagement.closeWindow('login')
  }

  update() {
    return true
  }

  createElement() {
    const { children, login } = this
    return html`
      <div class="${styles.container} login-container">
        <div class="${styles.logo} login-logo">
          <img src="../assets/images/ARA_logo_horizontal.png"/>
        </div>
        <div class="${styles.title} login-title">
          Log In
        </div>
        <p class="${styles.descriptionHolder} login-descriptionHolder">
          Welcome to the <b>Ara File Manager</b>. Use this
          app to buy, sell, share, and earn rewards for files on
          the Ara Network across the web.
          <br><br>
          To get started, log in with your <b>Ara id</b>
        </p>
        <form class="${styles.form} login-form" onsubmit=${login}>
          ${children.userDIDInput.render()}
          ${children.passwordInput.render()}
          ${children.loginButton.render({})}
        </form>
        <div class="${styles.buttonHolder} login-buttonHolder">
          <b>Need to recover your id?</b>
          ${children.recoverButton.render({})}
          <div style="height: 10px;"></div>
          <b>Don't have an account?</b>
          ${children.registerButton.render({})}
          ${children.cancelButton.render({})}
        </div>
      </div>
    `
  }
}

module.exports = Login