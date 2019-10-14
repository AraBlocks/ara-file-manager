const Button = require('../../components/button')
const Input = require('../../components/input')
const sidebarSection = require('./sidebarSection')
const { clipboard, remote } = require('electron')
const { app } = remote.require('electron')
const { events } = require('k')
const { utils } = require('../../lib/tools')
const styles = require('./styles/sidebar')
const TabItem = require('../../components/tabItem')
const windowManagement = require('../../lib/tools/windowManagement')
const html = require('nanohtml')
const Nanocomponent = require('nanocomponent')
const windowManager = remote.require('electron-window-manager')

class Sidebar extends Nanocomponent {
  constructor({ account, accounts }) {
    super()

    this.props = {
      account,
      accounts
    }
    this.state = {
      deepLink: ''
    }

    this.children = {
      accountsSection: new sidebarSection({ account, accounts, type: 'Accounts'}),
      addAccountSection: new sidebarSection({ type: '+ Add Account' })
    }

    this.renderAccounts = this.renderAccounts.bind(this)
  }

  renderAccounts({ account, accounts }) {
    const { children } = this

    let sections = [ children.accountsSection, children.addAccountSection ]

    return html`
      <div class="${styles.sectionContainer} sidebarContainer-sectionContainer">
        ${children.accountsSection.render({ account, accounts })}
      </div>
    `
  }

  update(props) {
    this.props = { ...this.props, account: props.account, accounts: props.accounts}
    return true
  }

  createElement() {
    const {
      props,
      renderAccounts,
      children,
      state
    } = this

    return (html`
      <div class="${styles.container} sidebar-container">
        <div class="${styles.logoContainer} logo-container">
          <img style="height: 12px;" src="../assets/images/ARA_logo_horizontal_white.png" />
        </div>
        ${renderAccounts(props)}
        <div>
          ${children.addAccountSection.render({ account: props.account, accounts: props.accounts })}
        </div>
      </div>
    `)
  }
}

module.exports = Sidebar
