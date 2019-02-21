const k = require('../../lib/constants/stateManagement')
const Button = require('../components/button')
const { clipboard } = require('electron')
const { emit } = require('../lib/tools/windowManagement')
const DynamicTooltip = require('../components/dynamicTooltip')
const TestnetBanner = require('../components/testnetBanner')
const UtilityButton = require('../components/utilityButton')
const styles = require('./styles/accountInfo')
const { utils, windowManagement } = require('../lib/tools')
const html = require('nanohtml')
const Nanocomponent = require('nanocomponent')
const { shell } = require('electron')

class AccountInfo extends Nanocomponent {
  constructor(props) {
    super()
    const { account, application } = props

    this.props = {
      analyticsPermission: account.analyticsPermission,
      araBalance: account.araBalance,
      ethAddress: account.accountAddress,
      ethBalance: account.ethBalance,
      faucetStatus: account.faucetStatus,
      network: application.network,
      userDID: account.userDID
    }

    this.children = {
      closeButton: new UtilityButton({ children: 'close' }),
      requestTokensButton: new Button(this.faucetButtonOpts),
      sendTokensButton: new Button({
        children: 'Send Tokens',
        cssClass: { opts: { fontSize: '14', height: '3' } },
        onclick: () => windowManagement.openWindow('sendAra')
      }),

      araIDTooltip: new DynamicTooltip({
        children: this.props.userDID,
        onclick: () => clipboard.writeText(this.props.userDID)
      }),

      ethAddressTooltip: new DynamicTooltip({
        children: this.props.ethAddress,
        cssClass: { color: 'green' },
        onclick: () => clipboard.writeText(this.props.ethAddress)
      })
    }

    this.toggleAnalyticsPermission = this.toggleAnalyticsPermission.bind(this)
    this.rerender = this.rerender.bind(this)
  }

  get faucetButtonOpts() {
    const { props } = this

    const buttonOpts = { cssClass: {} }
    buttonOpts.cssClass.name = 'thinBorder'
    buttonOpts.cssClass.opts = { fontSize: '14', height: '3' }
    buttonOpts.onclick = () => {}
    buttonOpts.children = '1000 Tokens is Faucet limit!'

    if (Number(props.araBalance) >= 1000) {
      return buttonOpts
    }

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

  toggleAnalyticsPermission() {
    emit({ event: k.TOGGLE_ANALYTICS_PERMISSION })
    this.render({})
  }

  araOneLink() {
    shell.openExternal("https://ara.one")
  }

  update(props = {}) {
    this.props = { ...this.props, ...props.account }
    return true
  }

  createElement() {
    const {
      children,
      faucetButtonOpts,
      toggleAnalyticsPermission,
      araOneLink,
      props,
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
                <div>Your <b>Ara ID is:</b></div>
                ${children.araIDTooltip.render()}
                <div>Your <b>Wallet Address</b> is:</div>
                ${children.ethAddressTooltip.render()}
            </div>
          </div>
          <div class="${styles.interactiveSection} accountInfo-interactiveSection">
            <div class="request-container">
              <b>Request test tokens:</b>
              ${children.requestTokensButton.render(faucetButtonOpts)}
            </div>
            <div class="send-container">
              <b>Send tokens to another account:</b>
              ${children.sendTokensButton.render({})}
            </div>
          </div>
        </div>
        <div class="${styles.appInfo} accountInfo-appInfo">
            <div>Note: Tokens will only work on testnet.</div>
          <div class="link-holder">
            <a onclick=${toggleAnalyticsPermission}>
              ${props.analyticsPermission ? 'Disable Analytics' : 'Enable Analytics' }
            </a>
            <b>|</b>
            <a onclick=${araOneLink}>
              ara.one
            </a>
          </div>
        </div>
        <div style="height:${utils.shouldShowBanner(props.network) ? 50  : 0}px;"></div>
      </div>
    `
  }
}

module.exports = AccountInfo