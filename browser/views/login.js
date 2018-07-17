'use strict'

const { osxSurfaceAids } = require('../lib/store/accountSelection')
const Button = require('../components/button')
const Input = require('../components/input')
const styles = require('./styles/login')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

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
        }
      }),

      loginButton: new Button({
        children: 'Log In'
      }),

      registerButton: new Button({
        children: 'Create One',
        cssClass: { name: 'smallInvisible' }
      }),

      passwordInput: new Input({
        parentState: this.state,
        field: 'passwordValue',
        placeholder: 'Password'
      }),

      usernameInput: new Input({
        parentState: this.state,
        field: 'usernameValue',
        placeholder: 'Username',
      }),
    }

    this.login = this.login.bind(this)
  }

  async login(e) {
    e.preventDefault()
    const { usernameValue, passwordValue } = this.state
    if (usernameValue === 'kit' && passwordValue === 'abc') {
      console.log(osxSurfaceAids())
    } else {
      return
    }
  }

  update(){
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
          <br>
          To get started, log in with your <b>ARA id</b>
        </p>
        <form class="${styles.form} login-form" onsubmit=${login}>
          ${children.usernameInput.render()}
          ${children.passwordInput.render()}
          ${children.loginButton.render()}
        </form>
        <div class="${styles.buttonHolder} login-buttonHolder">
          <b>Don't have a password?</b>
          ${children.registerButton.render()}
          ${children.cancelButton.render()}
        </div>
      </div>
    `
  }
}

module.exports = Login