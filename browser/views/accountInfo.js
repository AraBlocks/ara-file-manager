'use strict'

const k = require('../../lib/constants/stateManagement')
const araUtil = require('ara-util')
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
      faucetStatus: account.faucetStatus,
      araBalance: account.araBalance,
      ethAddress: account.accountAddress,
      ethBalance: account.ethBalance,
      network: application.network,
      userDID: araUtil.getIdentifier(account.userAid),
      version
    }

    this.children = {
      closeButton: new UtilityButton({ children: 'close' }),
      requestTokensButton: new Button(this.faucetButtonOpts),
      sendTokensButton: new Button({
        children: 'Send Tokens',
        cssClass: { opts: { fontSize: '14', height: '3' } },
        onclick: () => windowManagement.openWindow('sendAra')
      })
    }
    this.eventMouseLeave = document.createEvent('MouseEvents')
    this.eventMouseEnter = document.createEvent('MouseEvents')
    this.eventMouseLeave.initMouseEvent('mouseleave', true, true)
    this.eventMouseEnter.initMouseEvent('mouseenter', true, true)
    this.renderCopyableText = this.renderCopyableText.bind(this)
    this.rerender = this.rerender.bind(this)
  }

  renderCopyableText(textType) {
    const { eventMouseEnter, props } = this

    const text = textType === 'did'
      ? props.userDID.slice(-64)
      : props.ethAddress
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

  get faucetButtonOpts() {
    const { props } = this

    const buttonOpts = { cssClass: {} }
    buttonOpts.cssClass.name = 'thinBorder'
    buttonOpts.cssClass.opts = { fontSize: '14', height: '3' }
    buttonOpts.onclick = () => {}

    switch (props.faucetStatus) {
      case null:
        buttonOpts.children = 'Request Tokens'
        buttonOpts.cssClass.opts.color = 'green'
        buttonOpts.cssClass.name = ''
        buttonOpts.onclick = () => windowManagement.emit({ event: k.LISTEN_FOR_FAUCET })
        break
      case k.IN_FAUCET_QUEUE:
        buttonOpts.children = 'Faucet is sending tokens...'
        break
      case k.GREYLISTED_FROM_FAUCET:
        buttonOpts.children = 'Greylisted for 24 hours!'
        break
      case k.FAUCET_LIMIT_HIT:
        buttonOpts.children = '1000 Tokens is Faucet limit!'
        break
      default:
        buttonOpts.children = 'Faucet is down...Try again later'
    }

    return buttonOpts
  }

  update(props = {}) {
    this.props = { ...this.props, ...props.account }
    return true
  }

  createElement() {
    const {
      children,
      faucetButtonOpts,
      props,
      renderCopyableText
    } = this

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
              <span class="balance">${utils.roundDecimal(props.araBalance, 10000).toLocaleString()}</span>
              <span class="${styles.araBalance} accountInfo-araBalance">ARA</span>
            </div>
            <div>
              <span class="balance ethBalance">${utils.roundDecimal(props.ethBalance, 10000).toLocaleString()}</span>
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
              ${children.requestTokensButton.render(faucetButtonOpts)}
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