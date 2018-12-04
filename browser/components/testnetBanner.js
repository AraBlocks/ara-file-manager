'use strict'

const html = require('choo/html')
const styles = require('./styles/testnetBanner')

module.exports = () =>
  html`
    <div class="${styles.container} testnetBanner-container">
      <p>
        <b>Note:</b> This is a pre-release build of the Ara File Manager, intended for testing purposes only. All tokens and
          network activity are being run on an Ethereum testnet. Ara Tokens acquired and used through this app are for
          testing purposes only, and hold no financial value
      </p>
    </div>`
