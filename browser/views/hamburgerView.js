'use strict'

const Menu = require('../components/hamburgerMenu/menu')
const OptionsCheckbox = require('../components/optionsCheckbox')
const UtilityButton = require('../components/utilityButton')
const WalletInfo = require('./mainManager/walletInfo')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class HamburgerView extends Nanocomponent {
  constructor() {
    super()

    this.menu = new Menu({
      items: [{ children: 'File Manager' }, { children: 'Quit' }]
    })
    this.close = new UtilityButton({ children: '✕' })
    this.expand = new UtilityButton({ children: '▼' })
    this.wallet = new WalletInfo({
      araOwned: 9999,
      exchangeRate: 1.73
    })
    this.options = new OptionsCheckbox({ field: 'priceManagement' })
    window.hamburger = this
  }

  update() {
    return true
  }

  createElement(chooState) {
    const {
      menu,
      close,
      expand,
      wallet,
      options
    } = this

    return html`
      <div class="modal">
        ${menu.render()}
        ${close.render({})}
        ${expand.render({})}
        ${wallet.render()}
        ${options.render()}
      </div>
    `
  }
}

module.exports = HamburgerView