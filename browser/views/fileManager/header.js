'use strict'


const Button = require('../../components/button')
const { clipboard } = require('electron')
const { DEPLOY_PROXY } = require('../../../lib/constants/stateManagement')
const DynamicTooltip = require('../../components/dynamicTooltip')
const { emit } = require('../../lib/tools/windowManagement')
const { utils } = require('../../lib/tools')
const styles = require('./styles/header')
const UtilityButton = require('../../components/utilityButton')
const TabItem = require('../../components/tabItem')
const windowManagement = require('../../lib/tools/windowManagement')
const html = require('nanohtml')
const Nanocomponent = require('nanocomponent')

class Header extends Nanocomponent {
  constructor({ selectTab, account }) {
    super()

    this.props = {
      account,
      userDID: account.userAid
    }
    this.children = {
      publishFilebutton: new Button({
        children: 'Publish New File',
        cssClass: { opts: { fontSize: 14 } },
        onclick: () => {
          if (account.pendingPublish) { return }
          emit({ event: DEPLOY_PROXY })
        }
      }),
      closeButton: new UtilityButton({ children: 'close' }),
      copyDidTooltip: new DynamicTooltip({
        children: "ID: " + this.props.userDID.slice(0, 8) + "...",
        onclick: () => clipboard.writeText(this.props.userDID),
        cssClass: { color: 'black' }
      }),
      minimizeButton: new UtilityButton({ children: 'minimize', onclick: windowManagement.minimizeWindow }),
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

  update() {
    return true
  }

  createElement({ activeTab, araBalance }) {
    const {
      children,
      props
    } = this
    const balanceElements = [
      html`<img class="${styles.iconHolder} header-iconHolder" src="../assets/images/Ara-A.svg"/>`,
      utils.roundDecimal(araBalance, 100).toLocaleString()
    ]
    return html`
      <div class="${styles.container} header-container">
        <div class="${styles.subHeader} header-subheader">
          <div>
            <img style="height: 12px;" src="../assets/images/ARA_logo_horizontal.png"/>
          </div>
          <div class="${styles.windowControlsHolder} header-windowControlsHolder">
            ${children.minimizeButton.render({ children: 'minimize' })}
            ${children.closeButton.render({ children: 'close' })}
          </div>
        </div>
        <div class="${styles.subHeader} header-subheader">
          <div class="${styles.titleHolder} header-titleHolder">
            File Manager
          </div>
          <div class="${styles.userHolder} header-userHolder">
            ${children.copyDidTooltip.render()}
            <div>
              ${araBalance >= 0 ? balanceElements : 'Calculating Balance...'}
            </div>
          </div>
        </div>
        <div class="${styles.tabHolder} header-tabHolder">
          ${children.tabs.map((tab, index) => tab.render({ isActive: activeTab === index }))}
        </div>
        <div class="${styles.publishFilebuttonHolder} header-publishFilebuttonHolder">
          ${children.publishFilebutton.render({
        cssClass: props.account.pendingPublish
          ? { name: 'thinBorder', opts: { fontSize: 14 } }
          : { opts: { fontSize: 14 } }
      })}
        </div>
      </div>
    `
  }
}

module.exports = Header