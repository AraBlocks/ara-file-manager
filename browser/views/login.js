const { stateManagement: k } = require('k')
const windowManagement = require('../lib/tools/windowManagement')
const Nanocomponent = require('nanocomponent')
const html = require('nanohtml')
const getFormData = require('get-form-data')

console.log("BLEH:", getFormData)

class Login extends Nanocomponent {
  constructor({ userDID }) {
    super()

    this.state = { password: '', userDID }
  }

  login(e) {
    e.preventDefault()

    const load = getFormData(e.currentTarget)

    windowManagement.emit({ event: k.LOGIN, load })
    windowManagement.closeWindow('login')
  }

  register(e) {
    console.log("REGISTER:")
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
      <div class="flex flex-column pa3">
        <div class="flex justify-center">
          <img class="w3 h1" src="../assets/images/ARA_logo_horizontal.png" />
        </div>
        <div class="header mt3">
          Log In
        </div>
        <div class="mb3 copy">
          Welcome to the <span class="b">Ara File Manager</span>. Use this
          app to buy, sell, share, and earn rewards for files on
          the Ara Network across the web.
          <br><br>

          <span>To get started, log in with your <span class="b">Ara ID</span> or
          <a href="#" onclick=${this.register}>Create One</a></span>
        </div>
        <form onsubmit=${this.login} class="flex flex-column mb3">
          <input type="text" placeholder="Ara ID" name="userDID" class="mb3" value=${this.state.userDID}>
          <input type="password" placeholder="Password" name="password" class="mb3">
          <button type="submit" class="b">Log in</button>
        </form>
        <div class="flex flex-column items-center">
          <span class="b mb2">Need to recover your Ara ID?</span>
          <a href="#" onclick=${this.recover} class="mb2">Recover</button>
          <a href="#" onclick=${this.cancel} class="destructive">Cancel</button>
        </div>
      </div>
    `
  }
}

module.exports = Login
