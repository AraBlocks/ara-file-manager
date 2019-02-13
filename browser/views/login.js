const { stateManagement: k } = require('k')
const Nanocomponent = require('nanocomponent')

const Button = require('../components/button')
const html = require('nanohtml')
const Input = require('../components/input')
const Link = require('../components/link')
const styles = require('./styles/login')
const windowManagement = require('../lib/tools/windowManagement')

class Login extends Nanocomponent {
  constructor({ userDID }) {
    super()
    this.state = { password: '', userDID }
    this.children = {
      cancelButton: new Button({
        children: 'Cancel',
        cssClass: {
          name: 'smallInvisible',
          opts: { color: 'orange', weight: 'light' }
        },
        onclick: () => windowManagement.closeWindow()
      }),
      loginButton: new Button({ children: 'Log In' }),
      recoverButton: new Button({
        children: 'Recover',
        cssClass: { name: 'smallInvisible' },
        onclick: () => {
          windowManagement.openWindow('recover')
          windowManagement.closeWindow('login')
        }
      }),
      registerLink: new Link({
        children: 'Create One',
        onclick: () => {
          windowManagement.emit({ event: k.CREATE_USER_DID })
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
        placeholder: 'Ara ID'
      }),
    }
    this.login = this.login.bind(this)
  }

  login(e) {
    e.preventDefault()
    const { userDID, password } = this.state
    const load = { password, userDID: userDID }
    windowManagement.emit({ event: k.LOGIN, load })
    windowManagement.closeWindow('login')
  }

  update({ userDID } = {}) {
    this.state.userDID = userDID || this.state.userDID
    return true
  }

  createElement() {
    const { children, login } = this
    return (html`
      <div class="${styles.container} login-container">
        <div class="${styles.logo} login-logo">
          <img src="../assets/images/ARA_logo_horizontal.png" />
        </div>
        <div class="${styles.title} login-title">
          Log In
        </div>
        <p class="${styles.descriptionHolder} login-descriptionHolder">
          Welcome to the <b>Ara File Manager</b>. Use this
          app to buy, sell, share, and earn rewards for files on
          the Ara Network across the web.
          <br><br>
          To get started, log in with your <b>Ara ID</b> or
          ${children.registerLink.render()}
        </p>
        <form class="${styles.form} login-form" onsubmit=${login}>
          ${children.userDIDInput.render()}
          ${children.passwordInput.render()}
          ${children.loginButton.render({})}
        </form>
        <div class="${styles.buttonHolder} login-buttonHolder">
          <b>Need to recover your Ara ID?</b>
          ${children.recoverButton.render({})}
          <div style="height: 10px;"></div>
          ${children.cancelButton.render({})}
        </div>
      </div>
    `)
  }
}

module.exports = Login