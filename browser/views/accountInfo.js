'use strict'

const Button = require('./components/button')
const TestnetBanner = require('./components/TestnetBanner')
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
    const { props } = this
    return html`
      <div class="${} modal"></div>
    `
  }
}

module.exports = AccountInfo