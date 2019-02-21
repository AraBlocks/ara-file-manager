const html = require('nanohtml')
const { stateManagement: k } = require('k')
const Nanocomponent = require('nanocomponent')

const Button = require('../components/button')
const { closeWindow, emit } = require('../lib/tools/windowManagement')
const ErrorInput = require('../components/errorInput')
const overlay = require('../components/overlay')
const styles = require('./styles/registration')

class Registration extends Nanocomponent {
  constructor() {
    super()
    this.state = {
      displayError: { password: false, passwordConfirm: false },
      password: '',
      passwordConfirm: '',
    },
    this.props = { inputDisabled: true, mnemonic: null, userDID: null, }
    this.children = {
      passwordInput: new ErrorInput({
        errorMessage: 'Must enter password',
        placeholder: 'Password',
        parentState: this.state,
        field: 'password',
        type: 'password',
        disabled: true
      }),
      passwordConfirmInput: new ErrorInput({
        errorMessage: 'Must confirm password',
        placeholder: 'Confirm password',
        parentState: this.state,
        field: 'passwordConfirm',
        type: 'password',
        disabled: true
      }),
      submitButton: new Button({ children: 'OK', type: 'submit' }),
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
        onclick: () => closeWindow('registration')
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
    const { mnemonic, userDID } = this.props
    this.properInput
      ? emit({ event: k.REGISTER, load: { password, mnemonic, userDID } })
      : this.rerender()
  }

  update(newProps = {}) {
    Object.assign(this.props, newProps)
    return true
  }

  createElement({ pending = false } = {}) {
    const {
      children,
      props,
      register,
      state
    } = this
    return (html`
      <div class="modal">
        ${overlay(pending)}
        <div class="${styles.logo} registration-logo">
          <img src="../assets/images/ARA_logo_horizontal.png"/>
        </div>
        <div class="${styles.header} registration-header">Ara ID</div>
        <p class="${styles.description} registration-description">
          Welcome to the Ara File Manager. <b>An Ara ID will be generated for
          you</b>. Once it's generated, enter your desired password and save it somewhere safe, as <b>there
          is no way to recover it if lost</b>.
        </p>
        <div class="${styles.araIDHolder} registration-araIDHolder">
          <div class="${styles.araID} registration-araID">
            ${props.userDID
              ? (html`
                  <div style="animation: fadein 1500ms; width: 100%;">
                    ${props.userDID.slice(-64)}
                  </div>
                `)
              : (html`
                <div class="${styles.generatingMessage} registration-generatingMessage">
                  Generating Ara Identity
                  <span class="bounce">
                    <div></div>
                    <div class="dot2"></div>
                    <div class="dot3"></div>
                  </span>
                </div>
              `)}
          </div>
        </div>
        <form class="${styles.registerForm}" onsubmit="${register}">
          ${children.passwordInput.render({
            disabled: props.inputDisabled,
            displayError: state.displayError.password
          })}
          ${children.passwordConfirmInput.render({
            disabled: props.inputDisabled,
            displayError: state.displayError.passwordConfirm,
            errorMessage: state.passwordConfirm === ''
              ? 'Must confirm password'
              : "Passwords don't match"
          })}
          ${children.submitButton.render()}
        </form>
        ${children.cancelButton.render()}
      </div>
    `)
  }
}

module.exports = Registration