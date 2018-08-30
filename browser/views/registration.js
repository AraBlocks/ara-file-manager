'use strict'

const debug = require('debug')('acm:browser:views:registration')
const Button = require('../components/button')
const { closeWindow } = require('../lib/tools/windowManagement')
const { emit } = require('../lib/tools/windowManagement')
const Input = require('../components/input')
const overlay = require('../components/overlay')
const styles = require('./styles/registration')
const { REGISTER } = require('../../lib/constants/stateManagement')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class Registration extends Nanocomponent {
  constructor() {
    super()

    this.state = { password : 'abc' }

    this.passwordInput = new Input({
      placeholder: 'Password',
      parentState: this.state,
      field: 'password',
      type: 'password'
    })

    this.submitButton = new Button({
      children: 'Register',
      type: 'submit'
    })

    this.cancelButton = new Button({
      children: 'Cancel',
      cssClass: {
        name: 'smallInvisible',
        opts: {
          color: 'blue',
          weight: 'light'
        }
      },
      onclick: () => closeWindow()
    })

    this.register = this.register.bind(this)
    this.render = this.render.bind(this)
  }

  register(e) {
    e.preventDefault()
    const { password } = this.state
    debug('Registering with password: %s', password)
    emit({ event: REGISTER, load: password })
    this.render({ pending: true })
  }

  update() {
    return true
  }

  createElement({ pending = false }) {
    const {
      cancelButton,
      passwordInput,
      submitButton,
      register
    } = this

    return html`
      <div class="modal">
        ${overlay(pending)}
        <div class=${styles.header}>LTLSTAR</div>
        <div class=${styles.header}>Register</div>
        <p class=${styles.description}>
          To use the <b>Littlstar Media Manager</b>, you'll need to create an ARA id. We will generate the ID
          for you, but save your password somewhere safe, as <b>there is no way to recover it if lost</b>.
        </p>
        <form class=${styles.registerForm} onsubmit=${register}>
          ${passwordInput.render({})}
          ${submitButton.render({})}
        </form>
        ${cancelButton.render({})}
      </div>
    `
  }
}

module.exports = Registration