const account = require('./account')
const styles = require('./styles/sidebarSection')
const html = require('nanohtml')
const Nanocomponent = require('nanocomponent')
const box = require('component-box')
const windowManagement = require('../../lib/tools/windowManagement')

box.use({ account })

class SidebarSection extends Nanocomponent {
  constructor({ account = null, accounts = null, type = '' }) {
    super()
    this.props = { account, accounts, type }
    this.makeRows = this.makeRows.bind(this)
    this.box = box

    this.onClick = this.onClick.bind(this)
  }

  makeRows(currAccount, accounts) {
    const { typeRow } = this.props
    return Object.keys(accounts).map((account, i, array) => {
      if (account !== 'last') {
        const current = currAccount.userDID === account
        const constructorArgs = [{ account, name: accounts[account], current, index: i, length: array.length - 1 }]
        return box('account', { key: account, constructorArgs })
          .render({ name: accounts[account], current, index: i, length: array.length - 1 })
      }
    })
  }

  onClick() {
    if (this.props.type === '+ Add Account') {
      windowManagement.emit({ event: events.CREATE_USER_DID, load: { logout: true } })
      windowManagement.openWindow('registration')
    }
  }

  update(props) {
    this.props = { ...this.props, account: props.account, accounts: props.accounts }
    return true
  }

  createElement() {
    const { props, makeRows, onClick } = this
    return (html`
      <div>
        <div class="${styles.header(props.type !== 'Accounts')} section-header" onclick=${onClick}>
          ${props.type}
        </div>
        ${props.type === 'Accounts' ? makeRows(props.account, props.accounts) : html`<div></div>`}
      </div>
    `)
  }
}

module.exports = SidebarSection
