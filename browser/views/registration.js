const Button = require('../components/button')
const windowManagement = require('../lib/tools/windowManagement')
const { emit } = require('../lib/tools/windowManagement')
const ErrorInput = require('../components/errorInput')
const overlay = require('../components/overlay')
const styles = require('./styles/registration')
const k = require('../../lib/constants/stateManagement')
const html = require('nanohtml')
const Nanocomponent = require('nanocomponent')

class Registration extends Nanocomponent {
  constructor() {
    super()

    this.state = {
      password: '',
      passwordConfirm: '',
      displayError: {
        password: false,
        passwordConfirm: false
      }
     }

    this.children = {
      passwordInput: new ErrorInput({
        errorMessage: 'Must enter password',
        placeholder: 'Password',
        parentState: this.state,
        field: 'password',
        type: 'password'
      }),

      passwordConfirmInput: new ErrorInput({
        errorMessage: 'Must confirm password',
        placeholder: 'Confirm password',
        parentState: this.state,
        field: 'passwordConfirm',
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

  get properInput() {
    const {
      password,
      passwordConfirm,
      displayError
    } = this.state

    let properInput = true
    if (password === '') {
      displayError.password = true
      displayError.passwordConfirm = false
      properInput = false
    } else if (passwordConfirm === '') {
      displayError.password = false
      displayError.passwordConfirm = true
      properInput = false
    } else if (password !== passwordConfirm) {
      displayError.password = false
      displayError.passwordConfirm = true
      properInput = false
    }

    return properInput
  }

  register(e) {
    e.preventDefault()
    const { password } = this.state

    this.properInput
      ? emit({ event: k.REGISTER, load: password })
      : this.rerender({})
  }

  update() {
    return true
  }

  createElement({ pending = false }) {
    const { children, register, state } = this

    return html`
      <div class="modal">
        ${overlay(pending)}
        <div class="${styles.logo} login-logo">
          <img src="../assets/images/ARA_logo_horizontal.png"/>
        </div>
        <div class="${styles.header}">Register</div>
        <p class="${styles.description}">
          Welcome to the <b>Ara File Manager</b>. An <b>Ara ID</b> will be generated for
          you once a password is chosen. Save your password somewhere safe, as <b>there
          is no way to recover it if lost</b>.
        </p>
        <form class="${styles.registerForm}" onsubmit="${register}">
          ${children.passwordInput.render({ displayError: state.displayError.password })}
          ${children.passwordConfirmInput.render({
            displayError: state.displayError.passwordConfirm,
            errorMessage: state.passwordConfirm === ''
              ? 'Must confirm password'
              : "Passwords don't match"
          })}
          ${children.submitButton.render({})}
        </form>
        ${children.cancelButton.render({})}
      </div>
    `
  }
}

module.exports = Registration