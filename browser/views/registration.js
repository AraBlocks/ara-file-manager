const html = require('nanohtml')
const { events } = require('k')
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
      errorMessages: { password: '', pwConfirmation: '' },
      password: '',
      pwConfirmation: '',
    },
    this.props = { inputDisabled: true, mnemonic: null, userDID: null, identityProps: null }
    this.children = {
      passwordInput: new ErrorInput({
        disabled: this.props.inputDisabled,
        oninput: this.oninput('password'),
        placeholder: 'Password',
        type: 'password',
        value: this.state.password
      }),
      pwConfirmationInput: new ErrorInput({
        disabled: this.props.inputDisabled,
        oninput: this.oninput('pwConfirmation'),
        placeholder: 'Confirm password',
        type: 'password',
        value: this.state.pwConfirmation
      }),
      submitButton: new Button({
        children: 'OK',
        cssClass: { name: 'thinBorder' },
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
        onclick: () => closeWindow('registration')
      })
    }
    this.register = this.register.bind(this)
    this.render = this.render.bind(this)
  }

  get validInput() {
    const {
      password,
      pwConfirmation,
      errorMessages
    } = this.state

    errorMessages.pwConfirmation = ''
    errorMessages.password = ''
    let validInput = true
    if (password === '') {
      errorMessages.password = 'Must enter a password'
      validInput = false
    } else if (pwConfirmation === '') {
      errorMessages.pwConfirmation = 'Must confirm password'
      validInput = false
    } else if (password !== pwConfirmation) {
      errorMessages.pwConfirmation = "Passwords don't match"
      validInput = false
    }
    return validInput
  }

  oninput(key) {
    return (value) => {
      this.state[key] = value
      this.rerender()
    }
  }

  register(e) {
    e.preventDefault()
    const { password } = this.state
    const { mnemonic, userDID, identityProps } = this.props
    this.validInput
      ? emit({ event: events.REGISTER, load: { password, mnemonic, userDID, identityProps } })
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
            errorMessage: state.errorMessages.password,
            value: this.state.password
          })}
          ${children.pwConfirmationInput.render({
            disabled: props.inputDisabled,
            errorMessage: state.errorMessages.pwConfirmation,
            value: this.state.pwConfirmation
          })}
          ${children.submitButton.render({ cssClass: props.inputDisabled ? 'thinBorder' : 'standard'})}
        </form>
        ${children.cancelButton.render()}
      </div>
    `)
  }
}

module.exports = Registration
