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

tt({
  position: 'top',
  style: { width: '130px'}
})

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
          if (account.pendingTransaction) { return }
          windowManagement.openWindow('publishFileView')
        }
      }),
      closeButton: new UtilityButton({ children: 'close' }),
      minimizeButton: new UtilityButton({ children: '–', onclick: windowManagement.minimizeWindow }),
      tabs: this.makeTabs(selectTab)
    }

    this.eventMouseLeave = document.createEvent('MouseEvents')
    this.eventMouseEnter = document.createEvent('MouseEvents')
    this.eventMouseLeave.initMouseEvent('mouseleave', true, true)
    this.eventMouseEnter.initMouseEvent('mouseenter', true, true)
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
    const {
      children,
      eventMouseEnter,
      props
    } = this
    const balanceElements = [
      html`<img class="${styles.iconHolder} header-iconHolder" src="../assets/images/Ara-A.svg"/>`,
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
            ${children.closeButton.render({ children: 'close'})}
          </div>
        </div>
        <div class="${styles.subHeader} header-subheader">
          <div class="${styles.titleHolder} header-titleHolder">
            File Manager
          </div>
          <div class="${styles.userHolder} header-userHolder">
            <div
              data-tooltip="Copy to Clipboard"
              class="${styles.didHolder} header-didHolder"
              onclick=${({ target }) => {
                target.parentElement.dataset.tooltip = 'Copied!'
                target.parentElement.dispatchEvent(eventMouseEnter)
                target.parentElement.dataset.tooltip = 'Copy to Clipboard!'
                clipboard.writeText(props.userDID)
              }}
              onmouseenter=${({ target }) => target.style.backgroundColor = '#d0d0d0'}
              onmouseleave=${({ target }) => target.style.backgroundColor = ''}
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
            cssClass: props.account.pendingTransaction
              ? { name: 'thinBorder', opts: { fontSize: 14 }}
              : { opts: { fontSize: 14 } }
          })}
        </div>
      </div>
    `
  }
}

module.exports = Header