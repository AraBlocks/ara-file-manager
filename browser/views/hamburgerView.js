'use strict'

const ItemRow = require('./mainManager/itemRow')
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
    this.itemRow = new ItemRow({
      downloadPercent: 0.6,
      meta: {
        aid: 'did:ara:c7b86c29be073c0ceb27da22c03f10e7fadb9eb32dcf4a362639993cf963e6a6',
        datePublished: '11/20/1989',
        earnings: 237.43,
        peers: 1003,
        price: 56.99,
      },
      name: 'Adobe Photoshop',
      size: 10.67,
      status: 1,
    })

    this.itemRow2 = new ItemRow({
      downloadPercent: 0.6,
      meta: {
        aid: 'did:ara:c7b86c29be073c0ceb27da22c03f10e7fadb9eb32dcf4a362639993cf963e6a6',
        datePublished: '11/20/1989',
        earnings: 237.43,
        peers: 1003,
        price: 56.99,
      },
      name: 'Adobe Photoshop',
      size: 10.67,
      status: 2,
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
      wallet
    } = this

    return html`
      <div class="popup">
        ${menu.render()}
        ${close.render({})}
        ${expand.render({})}
        ${wallet.render()}
        ${itemRow.render()}
        ${itemRow2.render()}
      </div>
    `
  }
}

module.exports = HamburgerView