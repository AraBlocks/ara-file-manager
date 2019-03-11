const { events } = require('k')
const Button = require('../components/button')
const ErrorInput = require('../components/errorInput')
const overlay = require('../components/overlay')
const styles = require('./styles/recover')
const windowManagement = require('../lib/tools/windowManagement')
const html = require('nanohtml')
const Nanocomponent = require('nanocomponent')

class Recover extends Nanocomponent {
  constructor() {
    super()
    this.state = {
      pwConfirmation: '',
      errorMessages: {
        pwConfirmation: '',
        mnemonic: '',
        password: ''
      },
      mnemonic: '',
      password: '',
    }
    this.props = { pending: false }

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

      mnemonicInput: new ErrorInput({
        oninput: this.oninput('mnemonic'),
        placeholder: 'Mnemonic',
        type: 'password',
        value: this.state.mnemonic
      }),

      passwordInput: new ErrorInput({
        oninput: this.oninput('password'),
        placeholder: 'Password',
        type: 'password',
        value: this.state.value
      }),

      pwConfirmationInput: new ErrorInput({
        oninput: this.oninput('pwConfirmation'),
        placeholder: 'Confirm Password',
        type: 'password',
        value: this.state.pwConfirmation
      }),

      submitButton: new Button({
        children: 'Recover',
        onclick: this.recover.bind(this)
      })
    }
  }

  oninput(key) {
    return (value) => {
      this.state[key] = value
      this.rerender()
    }
  }

  recover(e) {
    e.preventDefault()
    const { password, mnemonic } = this.state

    if (this.validInput) {
      windowManagement.emit({ event: events.RECOVER, load: { password, mnemonic } })
    }
    this.rerender()
  }

  get validInput() {
    const {
      pwConfirmation,
      errorMessages,
      mnemonic,
      password
    } = this.state

    errorMessages.mnemonic = ''
    errorMessages.pwConfirmation = ''
    errorMessages.password = ''
    let validInput = true
    if (mnemonic.split(' ').length !== 12) {
      errorMessages.mnemonic = 'Mnemonic must be 12 words separated by a space'
      validInput = false
    if (!password) {
      errorMessages.password = 'Password must not be left blank'
      validInput = false
    } else if (!pwConfirmation) {
      errorMessages.pwConfirmation = 'Must confirm password'
      validInput = false
    } else if (pwConfirmation !== password) {
      errorMessages.pwConfirmation = "Passwords don't match"
      validInput = false
    }

    return validInput
  }

  update(newProps = {}) {
    Object.assign(this.props, newProps)
    return true
  }

  createElement() {
    const { children, props } = this
    const {
      errorMessages,
      mnemonic,
      password,
      pwConfirmation
    } = this.state

    return (html`
      <div class="${styles.container} recover-container">
        ${overlay(props.pending)}
        <div class="${styles.logo} login-logo">
          <img src="../assets/images/ARA_logo_horizontal.png" />
        </div>
        <div class="${styles.title} login-title">
          Recover
        </div>
        <form class="${styles.recoverForm} recover-recoverForm" onsubmit="${this.recover}">
          <div>To recover your Ara ID, please input your unique <b>mnemonic</b> code.</div>
          ${children.mnemonicInput.render({ errorMessage: errorMessages.mnemonic, value: mnemonic })}
          <div>Please create a new <b>password</b> for your Ara ID</div>
          ${children.passwordInput.render({ errorMessage: errorMessages.password, value: password })}
          ${children.pwConfirmationInput.render({
            errorMessage: errorMessages.pwConfirmation,
            value: pwConfirmation
          })}
          <div>
            ${children.submitButton.render({})}
            ${children.cancelButton.render({})}
          </div>
        </form>
      </div>
    `)
  }
}

module.exports = Recover