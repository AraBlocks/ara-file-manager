const html = require('nanohtml')
const styles = require('./styles/testnetBanner')

module.exports = () =>
  (html`
    <div class="${styles.container} testnetBanner-container">
      <p>
        <b>Note:</b> This pre-release build of the Ara File Manager uses
        the Ropsten Ethereum Testnet and Faucet, test Ether, and test Ara tokens.
      </p>
    </div>
  `)