'use strict'

const Button = require('../components/button')
const { clipboard } = require('electron')
const TestnetBanner = require('../components/TestnetBanner')
const UtilityButton = require('../components/UtilityButton')
const styles = require('./styles/accountInfo')
const { utils, windowManagement } = require('../lib/tools')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')
const { version } = require('../../package.json')
const tt = require('electron-tooltip')

tt({
  position: 'top',
  style: { width: '130px' }
})

class AccountInfo extends Nanocomponent {
  constructor(props) {
    super()
    const { account, application } = props

    this.props = {
      araBalance: account.araBalance,
      ethBalance: account.ethBalance,
      ethAddress: account.accountAddress,
      network: application.network,
      userDID: account.userAid,
      version
    }

    this.children = {
      closeButton: new UtilityButton({ children: 'close' }),
      requestTokensButton: new Button({
        children: 'Request Tokens',
        cssClass: {
          opts: {
            color: 'green',
            fontSize: '14',
            height: '3'
          }
        },
      }),
      sendTokensButton: new Button({
        children: 'Send Tokens',
        cssClass: {
          opts: {
            fontSize: '14',
            height: '3'
          }
        },
        onclick: () => windowManagement.openWindow('sendAra')
      })
    }

    this.renderCopyableText = this.renderCopyableText.bind(this)
    this.rerender = this.rerender.bind(this)
    this.eventMouseLeave = document.createEvent('MouseEvents')
    this.eventMouseEnter = document.createEvent('MouseEvents')
    this.eventMouseLeave.initMouseEvent('mouseleave', true, true)
    this.eventMouseEnter.initMouseEvent('mouseenter', true, true)
  }

  renderCopyableText(textType) {
    const {
      eventMouseEnter,
      props
    } = this
    let text = ''
    textType === 'did'
      ? text = props.userDID.slice(-64)
      : text = props.ethAddress
    return html`
      <div
        data-tooltip="Copy to Clipboard"
        class="${styles.copyableText} header-didHolder"
        onclick="${({ target }) => {
          target.parentElement.dataset.tooltip = 'Copied!'
          target.parentElement.dispatchEvent(eventMouseEnter)
          target.parentElement.dataset.tooltip = 'Copy to Clipboard!'
          clipboard.writeText(text)
        }}"
        onmouseenter="${({ target }) => target.style.backgroundColor = '#d0d0d0'}"
        onmouseleave="${({ target }) => target.style.backgroundColor = ''}"
      >
        <div class="${textType}">${text}</div>
      </div>
    `
  }

  update(props = {}) {
    this.props = { ...this.props, ...props }
    return true
  }

  createElement() {
    const { children, props, renderCopyableText } = this
    console.log(props)
    return html`
      <div class="${styles.container} accountInfo-container">
        ${utils.shouldShowBanner(props.network) ? TestnetBanner() : html`<div></div>`}
        <div class="${styles.closeBtnHolder} accountInfo-closeBtnHolder">${children.closeButton.render({ children: 'close' })}</div>
        <div class="${styles.accountOverview} accountInfo-accountOverview">
          <div class="${styles.banner} accountInfo-banner">Account</div>
            <div class="${styles.descriptionSection} accountInfo-descriptionSection">
              <div>
                Here you’ll find your Ara ID, Wallet Address, and app info. You can transfer Ara Tokens to other accounts from here as well.
              </div>
          </div>
        </div>
        <div class="${styles.contentHolder} accountInfo-contentHolder">
          <div class="${styles.balanceSection} accountInfo-balanceSection">
            <div><b>Your Wallet:</b></div>
            <div>
              <span class="balance">${utils.roundDecimal(props.araBalance, 10000)}</span>
              <span class="${styles.araBalance} accountInfo-araBalance">ARA</span>
            </div>
            <div>
              <span class="balance ethBalance">${utils.roundDecimal(props.ethBalance, 10000)}</span>
              <span class="${styles.ethBalance} ethBalance accountInfo-ara">ETH</span>
            </div>
          </div>
          <div class="${styles.idHolder} accountInfo-idHolder">
            <div class="container">
              <div>
                <div>Your <b>Ara ID is:</b></div>
                ${renderCopyableText('did')}
              </div>
              <div>
                <div>Your <b>Wallet Address</b> is:</div>
                ${renderCopyableText('eth')}
              </div>
            </div>
          </div>
          <div class="${styles.interactiveSection} accountInfo-interactiveSection">
            <div class="request-container">
              <b>Request test tokens:</b>
              <div>Note: these tokens are for testing purposes only, and will only work on testnet</div>
              ${children.requestTokensButton.render({})}
            </div>
            <div class="send-container">
              <b>Send tokens to another account:</b>
              ${children.sendTokensButton.render({})}
            </div>
          </div>
        </div>
        <div class="${styles.appInfo} accountInfo-appInfo">
          <b>App Version ${version}</b>
          <div class="link-holder">
            <a href="">Terms of Service</a>
            <b>|</b>
            <a href="">Contact Support</a>
          </div>
          <div>
            Copyright 2018, Ara Blocks LLC.
            <br>
            All rights reserved.
          </div>
        </div>
        <div style="height:${utils.shouldShowBanner(props.network) ? 50  : 0}px;"></div>
      </div>
    `
  }
}

module.exports = AccountInfo