const account = require('./account')
const styles = require('./styles/sidebarSection')
const html = require('nanohtml')
const Nanocomponent = require('nanocomponent')
const box = require('component-box')

box.use({ account })

class SidebarSection extends Nanocomponent {
  constructor({ account = null, accounts = null, type = '' }) {
    super()
    this.props = { account, accounts, typeRow: type }
    this.makeRows = this.makeRows.bind(this)
    this.box = box
  }

  makeRows(currAccount, accounts) {
    const { typeRow } = this.props
    return Object.keys(accounts).map((account, i) => {
      if (account !== 'last') {
        const constructorArgs = [{ account, name: accounts[account], current: currAccount.userDID === account }]
        return box('account', { key: account, constructorArgs })
          .render({ name: accounts[account] })
      }
    })
  }

  update(props) {
    this.props = { ...this.props, accounts: props.accounts}
    return true
  }

  createElement() {
    const { props, makeRows } = this
    return (html`
      <div >
        <div class="${styles.header} section-header">
          ${props.typeRow === 'accounts' ? 'Accounts' : props.typeRow === 'addAccount' ? '+ Add Account' : '+ Add Tokens'}
        </div>
        ${props.typeRow === 'accounts' ? makeRows(props.account, props.accounts) : html`<div></div>`}
      </div>
    `)
  }
}

module.exports = SidebarSection
