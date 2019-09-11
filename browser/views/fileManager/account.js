const ContextMenu = require('../../components/contextMenu')
const { events } = require('k')
const { menuHelper } = require('./util')
const { windowManagement } = require('../../lib/tools')
const Nanocomponent = require('nanocomponent')
const progressBar = require('./progressBar')
const styles = require('./styles/account')
const html = require('nanohtml')

class Account extends Nanocomponent {
  constructor({ account, typeRow, accounts }) {
    super()

    this.props = { typeRow, account }

  }

  update() {
    return true
  }

  createElement() {
    const { props: { account } } = this

    return (html`
      <div class="${styles.mainContainer}" style="color: white;">
        ${account.slice(0, 8) + '...'}
      </div>
    `)
  }

  static generator(opts) {
    return new Account(opts)
  }
}

module.exports = Account.generator
