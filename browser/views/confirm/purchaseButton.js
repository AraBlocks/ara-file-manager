'use strict'

const Ara3 = require('../../../lib/ethereum/ara3')
const html = require('choo/html')

module.exports = (state) => {
  const onclick = () => {
    const { ara3, purchaseRequest} = state
    ara3.makePurchase(purchaseRequest.license)
      .then(console.log)
  }

  return html`
    <button onclick=${onclick}>
      Purchase
    </button>
  `
}