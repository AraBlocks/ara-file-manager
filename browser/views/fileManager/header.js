'use strict'

const Button = require('../../components/button')
const styles = require('./styles/header')
const UtilityButton = require('../../components/utilityButton')
const TabItem = require('../../components/tabItem')
const { minimizeWindow } = require('../../lib/store/windowManagement')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class Header extends Nanocomponent {
  constructor({
    parentRerender,
    parentState,
    userBalance,
    username
  }) {
    super()

    this.props = {
      parentRerender,
      parentState,
      username
    }

    this.state = { userBalance }

    this.children = {
      publishFilebutton: new Button({
        children: 'Publish New File',
        cssClass: {
          opts: {
            color: 'blue',
            fontSize: 14
           }
        }
      }),
      closeButton: new UtilityButton({ children: '✕' }),
      minimizeButton: new UtilityButton({ children: '–', onclick: minimizeWindow }),
      tabs: this.makeTabs()
    }
  }

  makeTabs() {
    const { props } = this
    const children = ['All Files', 'Published Files', 'Purchases']
    return children.map((child, index) =>
      new TabItem({
        children: child,
        index,
        isActive: index === props.parentState.activeTab,
        parentRerender: props.parentRerender,
        parentState: props.parentState,
      })
    )
  }

  update(){
    return true
  }

  createElement({ activeTab }) {
    const {
      children,
      props,
      state
    } = this

    return html`
     <div class="${styles.container} header-container">
      <div class="${styles.subHeader} header-subheader">
        <div>
          LTLSTAR
        </div>
        <div class="${styles.windowControlsHolder} header-windowControlsHolder">
          ${children.minimizeButton.render({ children: '–', onclick: minimizeWindow })}
          ${children.closeButton.render({ children: '✕', onclick: minimizeWindow })}
        </div>
      </div>
      <div class="${styles.subHeader} header-subheader">
        <div class="${styles.titleHolder} header-titleHolder">
          File Manager
        </div>
        <div class="${styles.userHolder} header-userHolder">
          <div>
            <b>${props.username}</b>
          </div>
          <div>
            ${state.userBalance} ARA
          </div>
        </div>
      </div>
      <div class="${styles.tabHolder} header-tabHolder">
        ${children.tabs.map((tab, index) => tab.render({ isActive: activeTab === index}))}
      </div>
      <div class="${styles.publishFilebuttonHolder} header-publishFilebuttonHolder">
        ${children.publishFilebutton.render()}
      </div>
     </div>
    `
  }
}

module.exports = Header