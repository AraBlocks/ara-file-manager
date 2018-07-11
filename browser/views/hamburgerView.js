'use strict'

const FileSection = require('./mainManager/fileSection')
const Menu= require('../components/hamburgerMenu/menu')
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
      fileSection 
    } = this

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