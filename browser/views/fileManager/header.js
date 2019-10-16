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
const windowManager = remote.require('electron-window-manager')

class Header extends Nanocomponent {
  constructor({ selectTab, account }) {
    super()
    this.props = {
      account,
      userDID: account.userDID,
      editing: false
    }

    this.children = {
      tabs: this.makeTabs(selectTab),
      copyDidTooltip: new DynamicTooltip({
        itemClicked: () => clipboard.writeText(this.props.userDID),
        cssClass: { color: 'black' }
      })
    }

    this.onClick = this.onClick.bind(this)
    this.checkCharCount = this.checkCharCount.bind(this)
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

  onClick() {
    const input = document.getElementById('accountName')
    input.setAttribute('class', `${styles.input} header-name`)
    input.setAttribute('contenteditable', true)
    if (input.innerText.endsWith('...')) input.innerText = input.innerText.slice(0, input.innerText.length - 3)
    this.editing = true
  }

  checkCharCount(e) {
    const input = document.getElementById('accountName')
    this.cachedAccountName = this.cachedAccountName || input.innerText

    switch (e.which) {
      case 27:
        input.innerText = this.cachedAccountName
        this.cachedAccountName = null
        input.removeAttribute('class')
        input.removeAttribute('contenteditable')
        this.editing = false
        break;
      case 13:
        if (!input.innerText) {
          input.innerText = this.cachedAccountName
        }
        this.cachedAccountName = null
        input.removeAttribute('class')
        input.removeAttribute('contenteditable')
        this.editing = false
        windowManagement.emit({ event: events.CHANGE_NAME, load: { did: this.props.userDID, name: input.innerText } })
        break;
      default:
        if (e.which !== 8 && !isArrowKey(e.which) && input.innerText.length > 19) e.preventDefault()
        break;
    }

    function isArrowKey(val) {
      return val > 36 && val < 41
    }
  }

  update(props) {
    this.props = { ...this.props, userDID: props.account.userDID }
    return !this.editing
  }

  createElement({ activeTab, account }) {
    const {
      props,
      onClick,
      checkCharCount,
      balanceElements,
      children,
      publishFileProps
    } = this

    return (html`
      <div class="${styles.container} header-container">
        <div class="${styles.subHeader} header-subheader" style="margin-top: 1%; align-items: center;">
          <div class="${styles.titleHolder} header-titleHolder">
            <div id="accountName" onclick=${onClick} onkeydown=${checkCharCount}>
              ${account.username.length > 20 ? account.username.slice(0, 20) + '...' : account.username}
            </div>
            <div class="${styles.userHolder} header-userHolder">
              ${children.copyDidTooltip.render({ children: 'ID: ' + props.userDID.slice(0, 8) + '...' })}
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
