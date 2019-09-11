const Button = require('../../components/button')
const Input = require('../../components/input')
const sidebarSection = require('./sidebarSection')
const { clipboard, remote } = require('electron')
const { app } = remote.require('electron')
const { events } = require('k')
const DynamicTooltip = require('../../components/dynamicTooltip')
const { utils } = require('../../lib/tools')
const styles = require('./styles/sidebar')
const TabItem = require('../../components/tabItem')
const windowManagement = require('../../lib/tools/windowManagement')
const html = require('nanohtml')
const Nanocomponent = require('nanocomponent')
const Hamburger = require('../../components/hamburger')
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

    // get accounts cache

    this.children = {
      accountsSection: new sidebarSection({ accounts, type: 'accounts'}),
      addAccountSection: new sidebarSection({ type: 'addAccount' }),
      addTokensSection: new sidebarSection({ type: 'addTokens' })
    }

    this.renderAccounts = this.renderAccounts.bind(this)
  }

  renderAccounts() {
    const { children, props: { account, accounts } } = this

    let sections = [ children.accountsSection, children.addAccountSection, children.addTokensSection ]

    return html`
      <div class="${styles.sectionContainer} sidebarContainer-sectionContainer">
        ${sections.map(section => section.render({ account, accounts }))}
      </div>
    `
  }

  update() {
    return true
  }

  createElement() {
    const {
      renderAccounts,
      children,
      state
    } = this

    return (html`
      <div class="${styles.container} sidebar-container">
        <div class="${styles.logoContainer} logo-container">
          <img style="height: 12px;" src="../assets/images/ARA_logo_horizontal_white.png" />
        </div>
        ${renderAccounts()}
      </div>
    `)
  }
}

module.exports = Sidebar
