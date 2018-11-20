'use strict'

const Button = require('../components/button')
const TestnetBanner = require('../components/TestnetBanner')
const UtilityButton = require('../components/UtilityButton')
const styles = require('./styles/accountInfo')
const package = require('../../package.json')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

const { version, network } = JSON.parse(package)

class AccountInfo extends Nanocomponent {
  constructor(props) {
    super()

    this.props = { ...props, network, version }
    this.children = {
      closeButton: new UtilityButton({ children: 'close' }),
      requestTokensButton: new Button({
        children: 'Request Tokens',
        cssClass: { opts: { fontSize: '18px' } },
      }),
      sendTokensButton: new Button({
        children: 'Send Tokens',
        cssClass: { opts: { fontSize: '18px' } },
      })
    }
  }

  update() {
    return true
  }

  createElement() {
    const { children, props } = this
    return html`
      <div class="${styles.container} accountInfo-container">
        ${network === 'test' ? TestnetBanner() : null}
        ${children.closeButton.render({ children: 'close'})}
        <div class="${styles.descriptionSection} accountInfo-descriptionSection">
          <div>
            Here you’ll find your Ara ID, Wallet Address, and app info. You can transfer Ara Tokens to other accounts from here as well.
          </div>
        </div>
        <div class="${styles.balanceSection} accountInfo-balanceSection">
          <div><b>Your wallet:</b></div>
          <div class="${styles.araBalance} accountInfo-araBalance">
            ${props.araBalance} <span class="${styles.araBalance} accountInfo-araBalance">ARA</span>
          </div>
          <div class="${styles.ethBalance} accountInfo-araBalance">
            ${props.ethBalance} <span class="${styles.ethBalance} accountInfo-ara">ETH</span>
          </div>
        </div>
        <div class="${styles.interactiveSection} accountInfo-interactiveSection">
          <div class="${styles.userDID} accountInfo-userDID">
            <div>Your <b>Ara ID is:</b></div>
            <div >${props.userDID}</div>
          </div>
          <div class="${styles.ethAddress} accountInfo-ethAddress">
            <div>Your <b>Wallet Address</b> is:</div>
            <div>${props.ethAddress}</div>
          </div>
        </div>
      </div>
    `
  }
}

module.exports = AccountInfo