const { stateManagement: k } = require('k')
const windowManagement = require('../lib/tools/windowManagement')
const Nanocomponent = require('nanocomponent')
const html = require('nanohtml')

class Login extends Nanocomponent {
  constructor({ userDID }) {
    super()

    this.state = { password: '', userDID }

    this.login = this.login.bind(this)
  }

  login(e) {
    e.preventDefault()

    const { userDID, password } = this.state
    const load = { password, userDID: userDID }

    windowManagement.emit({ event: k.LOGIN, load })
    windowManagement.closeWindow('login')
  }

  register(e) {
    windowManagement.emit({ event: k.CREATE_USER_DID })
    windowManagement.openWindow('registration')
    windowManagement.closeWindow('login')
  }

  recover(e) {
    windowManagement.openWindow('recover')
    windowManagement.closeWindow('login')
  }

  cancel(e) {
    windowManagement.closeWindow()
  }

  update({ userDID } = {}) {
    this.state.userDID = userDID || this.state.userDID

    return true
  }

  createElement() {
    return html`
      <div class="flex flex-column">
        <div class="w2 h2">
          <img src="../assets/images/ARA_logo_horizontal.png" />
        </div>
        <div class="f2">
          Log In
        </div>
        <div>
          Welcome to the <span class="b">Ara File Manager</span>. Use this
          app to buy, sell, share, and earn rewards for files on
          the Ara Network across the web.
          <br><br>
          To get started, log in with your <span class="b">Ara ID</span> or
        </div>
        <a href="#" class="f3" onclick=${this.register}>Create One</a>
        <form onsubmit=${this.login} class="flex flex-column">
          <input type="text" placeholder="Ara ID" name="userDID">
          <input type="password" placeholder="Password" name="password">
          <button type="submit">Log in</button>
        </form>
        <div class="flex flex-column">
          <span class="bold">Need to recover your Ara ID?</span>
          <button type="button" onclick=${this.recover} class="unemp">Recover</button>
          <button type="button" onclick=${this.cancel} class="destructive">Cancel</button>
        </div>
      </div>
    `
  }
}

module.exports = Login
