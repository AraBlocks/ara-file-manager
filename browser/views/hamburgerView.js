'use strict'

const Menu= require('../components/hamburgerMenu/menu')
const UtilityButton = require('../components/utilityButton')
const WalletView = require('./walletView')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')
const { colors } = require('styleUtils')

class HamburgerView extends Nanocomponent {
  constructor() {
    super()

    this.menu = new Menu({
      items: [{ children: 'File Manager' }, { children: 'Quit' }]
    })
    this.close = new UtilityButton({ children: '✕' })
    this.expand = new UtilityButton({ children: '▼' })
    this.wallet = new WalletView({ 
      araOwned: 9999, 
      exchangeRate: 1.73 
    })
    window.hamburger = this
  }

  update() {
    return true
  }

  createElement(chooState) {
    const { menu, close, expand, wallet } = this

    return html`
      <div class="popup">
        ${menu.render()}
        ${close.render()}
        ${expand.render()}
        ${wallet.render()}
      </div>
    `
  }
}

module.exports = HamburgerView