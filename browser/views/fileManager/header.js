const Button = require('../../components/button')
const Input = require('../../components/input')
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
      deepLink: '',
      hambyToggled: false
    }

    this.children = {
      hamby: new Hamburger(this.hambyOpts),
      tabs: this.makeTabs(selectTab),
      publishFilebutton: new Button({
        children: 'Publish New File',
        cssClass: { opts: { fontSize: 14 } },
        onclick: () => {
          if (!account.pendingPublish) {
            windowManagement.emit({ event: events.OPEN_MANAGE_FILE_VIEW})
          }
        }
      }),
      copyDidTooltip: new DynamicTooltip({
        children: 'ID: ' + this.props.userDID.slice(0, 8) + '...',
        onclick: () => clipboard.writeText(this.props.userDID),
        cssClass: { color: 'black' }
      }),
      deepLink: new Input({
        cssClass: { opts: { fontSize: '14px' } },
        placeholder: 'paste "ara://..." link here',
        onchange: () => {
          const { deepLink } = this.state
          if (!deepLink) { return }
          windowManager.openDeepLinking(deepLink)
          this.state.deepLink = ''
          this.rerender()
        },
        oninput: (value) => {
          this.state.deepLink = value
          this.rerender()
        }
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
      : html`<div style="font-size: 12px;">Getting balance..</div>`

    function makeElements() {
      const img = html`<img class="${styles.iconHolder} header-iconHolder" src="../assets/images/Ara-A.svg" />`
      const balance = utils.roundDecimal(account.araBalance, 100).toLocaleString()
      return [img, balance]
    }
  }
  get publishFileProps() {
    const { account } = this.props
    return {
      cssClass: account.pendingPublish
        ? { name: 'thinBorder', opts: { fontSize: 14 } }
        : { opts: { fontSize: 14 } }
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
          <div>
            <img style="height: 12px;" src="../assets/images/ARA_logo_horizontal.png" />
          </div>
          <div class="${styles.windowControlsHolder} header-windowControlsHolder">
            ${children.hamby.render({})}
          </div>
        </div>
        <div class="${styles.subHeader} header-subheader" style="align-items: center;">
          <div class="${styles.titleHolder} header-titleHolder">
            File Manager
          </div>

          <div class="${styles.userHolder} header-userHolder">
            ${children.copyDidTooltip.render()}
            <div>
              ${balanceElements}
            </div>
          </div>
        </div>
        <div>
          ${children.deepLink.render({ value: state.deepLink })}
        </div>
        <div class="${styles.tabHolder} header-tabHolder">
          ${children.tabs.map((tab, index) => tab.render({ isActive: activeTab === index }))}
        </div>
        <div class="${styles.publishFilebuttonHolder} header-publishFilebuttonHolder">
          ${children.publishFilebutton.render(publishFileProps)}
        </div>
      </div>
    `)
  }
}

module.exports = Header
