'use strict'

const Button = require('../../components/button')
const styles = require('./styles/header')
const UtilityButton = require('../../components/utilityButton')
const TabItem = require('../../components/tabItem')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class Header extends Nanocomponent {
  constructor({
    userBalance,
    username
  }) {
    super()

    this.props = { username }

    this.state = {
      activeTab: 0,
      userBalance
    }

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
      tabs: this.makeTabs()
    }
  }

  makeTabs() {
    const children = ['All Files', 'Published Files', 'Purchases']
    return children.map((child, index) =>
      new TabItem({
        children: child,
        index,
        isActive: index === this.state.activeTab,
        parentRerender: this.rerender.bind(this),
        parentState: this.state,
      })
    )
  }

  update(){
    return true
  }

  createElement() {
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
        <div class="${styles.closeButtonHolder} header-closeButtonHolder">
          ${children.closeButton.render()}
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
        ${children.tabs.map((tab, index) =>
          tab.render({ isActive: state.activeTab === index})
        )}
      </div>
      <div class="${styles.publishFilebuttonHolder} header-publishFilebuttonHolder">
        ${children.publishFilebutton.render()}
      </div>
     </div>
    `
  }
}

module.exports = Header