'use strict'

const { closeWindow, openWindow } = require('../lib/tools/windowManagement')
const styles = require('./styles/registration')
const html = require('choo/html')
const Input = require('../components/input')
const Button = require('../components/Button')
const register = require('../lib/register')
const Nanocomponent = require('nanocomponent')


class Registration extends Nanocomponent {
  constructor() {
    super()

    this.state = { password: '' }

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
      onclick: closeWindow
    })
  }

  update() {
    return true
  }

  createElement() {
    const {
      passwordInput,
      submitButton,
      cancelButton
    } = this

    return html`
      <div class="modal">
        <div class=${styles.header}>LTLSTAR</div>
        <div class=${styles.header}>Register</div>
        <p class=${styles.description}>
          To use the <b>Littlstar Media Manager</b>, you'll need to create an ARA id. We will generate the ID
          for you, but save your password somewhere safe, as <b>there is no way to recover it if lost</b>.
        </p>
        <form class=${styles.registerForm} onsubmit=${onsubmit}>
          ${passwordInput.render({})}
          ${submitButton.render({})}
        </form>
        ${cancelButton.render({})}
      </div>
    `
    function onsubmit(e) {
      e.preventDefault()
      register()
    }
  }
}

const { remote } = require('electron')
const windowManager = remote.require('electron-window-manager')

windowManager.bridge.on('REGISTERED', () => {
  openWindow('filemanager')
})
module.exports = Registration