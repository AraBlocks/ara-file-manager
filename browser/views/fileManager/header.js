'use strict'

const Button = require('../../components/button')
const styles = require('./styles/header')
const UtilityButton = require('../../components/utilityButton')
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
        cssClass: {
          opts: {
            color: 'blue',
            fontSize: 14
           }
        }
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
      <div
        style="
          display: flex;
          font-size: 14px;
        "
      >
        ${void '*****placeholder for tabs'}
        <div style="margin-right: 20px; font-family:${styles.fonts.bold}; color:${styles.colors.araRed};">All Files</div>
        <div style="margin-right: 20px;">Published Files</div>
        <div style="margin-right: 20px;">Purchases</div>
      </div>
      <div class="${styles.publishFilebuttonHolder} header-publishFilebuttonHolder">
        ${children.publishFilebutton.render()}
      </div>
     </div>
    `
  }
}

module.exports = Header