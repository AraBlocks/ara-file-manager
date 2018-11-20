'use strict'

const Button = require('../components/button')
const TestnetBanner = require('../components/TestnetBanner')
const UtilityButton = require('../components/UtilityButton')
const styles = require('./styles/accountInfo')
const { round: { roundDecimal } } = require('../lib/tools')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

const version = '1.0.0'
const network = 'test'

class AccountInfo extends Nanocomponent {
  constructor(props) {
    super()

    this.state = { showBanner: network === 'test'  }
    this.props = {
      araBalance: props.araBalance,
      ethBalance: props.ethBalance,
      ethAddress: props.accountAddress,
      network,
      userDID: props.userAid,
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
      })
    }

    this.removeBanner = this.removeBanner.bind(this)
    this.render = this.render.bind(this)
  }

  removeBanner() {
    this.state.showBanner = false
    this.render()
  }
  update(props = {}) {
    this.props = { ...this.props, ...props }
    return true
  }

  createElement() {
    const {
      children,
      props,
      removeBanner,
      state
    } = this
    return html`
      <div class="${styles.container} accountInfo-container">
        ${state.showBanner ? TestnetBanner(removeBanner) : html`<div></div>`}
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
              <span class="balance">${roundDecimal(props.araBalance, 10000)}</span>
              <span class="${styles.araBalance} accountInfo-araBalance">ARA</span>
            </div>
            <div>
              <span class="balance ethBalance">${roundDecimal(props.ethBalance, 10000)}</span>
              <span class="${styles.ethBalance} ethBalance accountInfo-ara">ETH</span>
            </div>
          </div>
          <div class="${styles.idHolder} accountInfo-idHolder">
            <div class="container">
              <div>
                <div>Your <b>Ara ID is:</b></div>
                <div class="did">${props.userDID.slice(-64)}</div>
              </div>
              <div>
                <div>Your <b>Wallet Address</b> is:</div>
                <div class="eth">${props.ethAddress}</div>
              </div>
            </div>
          </div>
          <div class="${styles.interactiveSection} accountInfo-interactiveSection">
            ${network === 'test'
              ? html`
                <div class="request-container">
                  <b>Request test tokens:</b>
                  <div>Note: these tokens are for testing purposes only, and will only work on testnet</div>
                  ${children.requestTokensButton.render({})}
                </div>
              `
              : null}
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
      </div>
    `
  }
}

module.exports = AccountInfo