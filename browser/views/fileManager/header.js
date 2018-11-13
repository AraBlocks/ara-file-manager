'use strict'


const Button = require('../../components/button')
const {	clipboard } = require('electron')
const { CLEAN_UI } = require('../../../lib/constants/stateManagement')
const styles = require('./styles/header')
const UtilityButton = require('../../components/utilityButton')
const TabItem = require('../../components/tabItem')
const windowManagement = require('../../lib/tools/windowManagement')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')
const tt = require('electron-tooltip')
const { remote } = require('electron')
const windowManager = remote.require('electron-window-manager')
const store = windowManager.sharedData.fetch('store')

tt({
  position: 'top',
  customContent() {
    return 'Copy To Clipboard'
  }
})

class Header extends Nanocomponent {
  constructor({ selectTab, userAid }) {
    super()

    this.props = { userDID: userAid }

    this.children = {
      publishFilebutton: new Button({
        children: 'Publish New File',
        cssClass: { opts: { fontSize: 14 } },
        onclick: () => {
          if (store.account.pendingTransaction) { return }
          windowManagement.openWindow('publishFileView')
        }
      }),
      closeButton: new UtilityButton({ children: '✕' }),
      minimizeButton: new UtilityButton({ children: '–', onclick: windowManagement.minimizeWindow }),
      tabs: this.makeTabs(selectTab)
    }
  }

  makeTabs(selectTab) {
    const children = ['All Files', 'Published Files', 'Purchases']
    return children.map((child, index) =>
      new TabItem({
        children: child,
        index,
        selectTab
      })
    )
  }

  update(){
    return true
  }

  createElement({ activeTab, araBalance }) {
    const { children, props } = this
    const balanceElements = [
      html`<img class="${styles.iconHolder} header-iconHolder" src="../assets/images/ara_token.png"/>`,
      Math.round(araBalance * 100) / 100
    ]
    return html`
      <div class="${styles.container} header-container">
        <div class="${styles.subHeader} header-subheader">
          <div onclick=${() => windowManagement.emit({ event: CLEAN_UI })}>
            <img style="height: 12px;" src="../assets/images/ARA_logo_horizontal.png"/>
          </div>
          <div class="${styles.windowControlsHolder} header-windowControlsHolder">
            ${children.minimizeButton.render({ children: '–'})}
            ${children.closeButton.render({ children: '✕'})}
          </div>
        </div>
        <div class="${styles.subHeader} header-subheader">
          <div class="${styles.titleHolder} header-titleHolder">
            File Manager
          </div>
          <div class="${styles.userHolder} header-userHolder">
            <div
              data-tooltip
              class="${styles.didHolder} header-didHolder"
              onclick=${() => clipboard.writeText(props.userDID)}
            >
              <b>ID: ${props.userDID.slice(8,14)}...</b>
            </div>
            <div>
              ${araBalance ? balanceElements : 'Calculating Balance...'}
            </div>
          </div>
        </div>
        <div class="${styles.tabHolder} header-tabHolder">
          ${children.tabs.map((tab, index) => tab.render({ isActive: activeTab === index}))}
        </div>
        <div class="${styles.publishFilebuttonHolder} header-publishFilebuttonHolder">
          ${children.publishFilebutton.render({
            cssClass: store.account.pendingTransaction
              ? { name: 'thinBorder', opts: { fontSize: 14 }}
              : { opts: { fontSize: 14 } }
          })}
        </div>
      </div>
    `
  }
}

module.exports = Header