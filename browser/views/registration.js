'use strict'

const Button = require('../components/button')
const windowManagement = require('../lib/tools/windowManagement')
const { emit } = require('../lib/tools/windowManagement')
const Input = require('../components/input')
const overlay = require('../components/overlay')
const styles = require('./styles/registration')
const k = require('../../lib/constants/stateManagement')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class Registration extends Nanocomponent {
  constructor() {
    super()

    this.state = { password : '' }

    this.children = {
      passwordInput: new Input({
        placeholder: 'Password',
        parentState: this.state,
        field: 'password',
        type: 'password'
      }),

      submitButton: new Button({
        children: 'Register',
        type: 'submit'
      }),

      cancelButton: new Button({
        children: 'Cancel',
        cssClass: {
          name: 'smallInvisible',
          opts: {
            color: 'orange',
            height: '15',
            weight: 'light'
          }
        },
        onclick: () => windowManagement.closeWindow()
      })
    }

    this.register = this.register.bind(this)
    this.render = this.render.bind(this)
  }

  register(e) {
    e.preventDefault()
    const { password } = this.state
    emit({ event: k.REGISTER, load: password })
  }

  update() {
    return true
  }

  createElement({ pending = false }) {
    const { children, register } = this
    return html`
      <div class="modal">
        ${overlay(pending)}
        <div class="${styles.logo} login-logo">
          <img src="../assets/images/ARA_logo_horizontal.png"/>
        </div>
        <div class=${styles.header}>Register</div>
        <p class=${styles.description}>
          To use the <b>Ara File Manager</b>, you'll need to create an Ara identity. We will generate the ID
          for you, but save your password somewhere safe, as <b>there is no way to recover it if lost</b>.
        </p>
        <form class=${styles.registerForm} onsubmit=${register}>
          ${children.passwordInput.render({})}
          ${children.submitButton.render({})}
        </form>
        ${children.cancelButton.render({})}
      </div>
    `
  }
}

module.exports = Registration