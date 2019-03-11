const { events } = require('k')
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
          windowManagement.emit({ event: events.CREATE_USER_DID })
          windowManagement.openWindow('registration')
          windowManagement.closeWindow('login')
        }
      }),
      passwordInput: new Input({
        oninput: this.oninput('password'),
        placeholder: 'Password',
        type: 'password',
        value: this.state.password
      }),
      userDidInput: new Input({
        oninput: this.oninput('userDID'),
        placeholder: 'Ara ID',
        value: this.state.userDID
      }),
    }
    this.login = this.login.bind(this)
    this.rerender = this.rerender.bind(this)
  }

  login(e) {
    e.preventDefault()
    const { userDID, password } = this.state
    windowManagement.emit({ event: events.LOGIN, load: { password, userDID } })
    windowManagement.closeWindow('login')
  }

  oninput(key) {
    return (value) => {
      this.state[key] = value
      this.rerender()
    }
  }

  update({ userDID } = {}) {
    this.state.userDID = userDID || this.state.userDID
    return true
  }

  createElement() {
    const { children, login, state } = this
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
          ${children.userDidInput.render({ value: state.userDID })}
          ${children.passwordInput.render({ value: state.password })}
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