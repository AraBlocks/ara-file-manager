const Button = require('../../components/button')
const { clipboard, remote } = require('electron')
const { app } = remote.require('electron')
const { events } = require('k')
const DynamicTooltip = require('../../components/dynamicTooltip')
const { utils } = require('../../lib/tools')
const styles = require('./styles/header')
const TabItem = require('../../components/tabItem')
const windowManagement = require('../../lib/tools/windowManagement')
const html = require('nanohtml')
const Nanocomponent = require('nanocomponent')
const Hamburger = require('../../components/hamburger')
const windowManager = remote.require('electron-window-manager')

class Header extends Nanocomponent {
  constructor({ selectTab, account }) {
    super()

    this.props = {
      account,
      userDID: account.userDID,
    }
    this.state = {
      hambyToggled: false
    }

    this.children = {
      hamby: new Hamburger(this.hambyOpts),
      tabs: this.makeTabs(selectTab),
      copyDidTooltip: new DynamicTooltip({
        children: 'ID: ' + this.props.userDID.slice(0, 8) + '...',
        itemClicked: () => clipboard.writeText(this.props.userDID),
        cssClass: { color: 'black' }
      })
    }
  }

  get hambyOpts() {
    const items = [
      { children: 'Account', onclick: () => windowManager.openWindow('accountInfo') },
      { children: 'Logout', onclick: () => windowManagement.emit({ event: events.LOGOUT }) },
      { children: 'Close', onclick: () => windowManagement.closeWindow() },
      { children: 'Quit', onclick: () => app.quit() },
    ]

    const toggleCB = (type) => {
      type === 'mouseleave'
        ? this.state.hambyToggled = false
        : this.state.hambyToggled = !this.state.hambyToggled
      this.rerender()
    }

    return { items, toggleCB, direction: 'left' }
  }

  makeTabs(selectTab) {
    const children = ['All Files', 'Published Files', 'Purchased Files']
    return children.map((child, index) =>
      new TabItem({
        children: child,
        index,
        selectTab
      })
    )
  }

  get balanceElements() {
    const { account } = this.props
    return account.araBalance !== null
      ? html`<div>${makeElements()}</div>`
      : html`<div style="font-size: 16px;">Getting balance..</div>`

    function makeElements() {
      const img = html`<img class="${styles.iconHolder} header-iconHolder" src="../assets/images/Ara-A.svg" />`
      const balance = utils.roundDecimal(account.araBalance, 100).toLocaleString()
      return [img, balance]
    }
  }

  update() {
    return true
  }

  createElement({ activeTab }) {
    const {
      balanceElements,
      children,
      publishFileProps,
      state
    } = this

    return (html`
      <div class="${styles.container(state.hambyToggled)} header-container">
        <div class="${styles.subHeader} header-subheader">
          <div class="${styles.windowControlsHolder} header-windowControlsHolder">
            ${children.hamby.render({})}
          </div>
          <div class="${styles.logoContainer} logo-container">
            <img style="height: 12px;" src="../assets/images/ARA_logo_horizontal.png" />
          </div>
        </div>
        <div class="${styles.subHeader} header-subheader" style="align-items: center;">
          <div class="${styles.titleHolder} header-titleHolder">
            Account 1
            <div class="${styles.userHolder} header-userHolder">
              ${children.copyDidTooltip.render()}
            </div>
          </div>

          <div>
            ${balanceElements}
          </div>
        </div>
        <div class="${styles.tabHolder} header-tabHolder">
          ${children.tabs.map((tab, index) => tab.render({ isActive: activeTab === index }))}
        </div>
      </div>
    `)
  }
}

module.exports = Header
