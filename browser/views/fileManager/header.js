'use strict'

const Button = require('../../components/button')
const styles = require('./styles/header')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class Header extends Nanocomponent {
  constructor({
    userBalance,
    username
  }) {
    super()

    this.children = {
      publishFilebutton: new Button({
        children: 'Publish New File',
      }),
      closeButton: new UtilityButton({ children: '✕' })
    }

    this.props = { username }

    this.state = {
      activeTab: 0,
      userBalance
     }
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
      <div class="${styles.subheader} header-subheader">
        <div>
          LTLSTAR
        </div>
        <div class="${styles.closeButtonHolder} header-closeButtonHolder">
          ${closeButton.render()}
        </div>
      </div>
      <div class="${styles.subheader} header-subheader">
        <div class="${styles.titleHolder} header-titleHolder">
          File Manager
        </div>
        <div class="${styles.userHolder} header-userHolder">
          <div>
            ${props.username}
          </div>
          <div>
            ${props.userBalance} ARA
          </div>
        </div>
      </div>
      ${navBar()}
      <div class="${styles.publishFilebuttonHolder} header-publishFilebuttonHolder">
        ${children.publishFilebutton.render()}
      </div>
     </div>
    `
  }
}

module.exports = Header