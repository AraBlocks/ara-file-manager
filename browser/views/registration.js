'use strict'

const styles = require('./styles/registration')
const html = require('choo/html')
const Input = require('../components/input')
const Button = require('../components/modalButton')
const Nanocomponent = require('nanocomponent')

class Registration extends Nanocomponent {
  constructor() {
    super()

    this.state = {}

    this.passwordInput = new Input({ placeholder: 'Password' })

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
      }
    })
  }

  update() {
    return true
  }

  createElement(chooState) {
    const {
      state,
      passwordInput,
      submitButton,
      cancelButton
    } = this

    return html`
      <div class="popup">
        <div class=${styles.header}>LTLSTAR</div>
        <div class=${styles.header}>Register</div>
        <p class=${styles.description}>
          To use the <b>Littlstar Media Manager</b>, you'll need to create an ARA id. We will generate the ID
          for you, but save your password somewhere safe, as <b>there is no way to recover it if lost</b>.
        </p>
        <form class=${styles.registerForm} onsubmit=${e => e.preventDefault()}>
          ${passwordInput.render({})}
          ${submitButton.render({})}
        </form>
        ${cancelButton.render({})}
      </div>
    `
  }
}

module.exports = Registration