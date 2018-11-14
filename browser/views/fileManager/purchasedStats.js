'use strict'

const k = require('../../../lib/constants/stateManagement')
const styles = require('./styles/purchasedStats')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class PurchasedStats extends Nanocomponent {
  update() {
    return true
  }

  renderEarnings(reedming, earnings, allocatedRewards) {
    return reedming
      ? html`<div class="${styles.redeemSpinner} publishedStats-redeemSpinner spinner-tiny-red"></div>`
      : [earnings, allocatedRewards ? html`<span style="color:green;">(+${allocatedRewards})</span>` : null]
  }

  createElement({
    allocatedRewards,
    earnings,
    peers,
    redeeming,
    status
   }) {
    const { renderEarnings } = this
    return html`
      <div class="${styles.container} purchasedStats-container">
        <div class="${styles.stats} purchasedStats-stats">
          ${[k.DOWNLOADING, k.DOWNLOADED_PUBLISHED].includes(status)
            ? [
              html`
                <div class="${styles.peers} purchasedStats-peers">
                  <span class="${styles.bolden} puchasedStats-bolden">Peers:</span> ${peers}
                </div>`,
              html`<div class="${styles.divider}">|</div>`
            ]
            : null}
          <div class="${styles.earnings(status)} purchasedStats-earnings">
            <span class="${styles.bolden} puchasedStats-bolden">Earnings:</span>
            ${renderEarnings(redeeming, earnings, allocatedRewards)}
          </div>
        </div>
      </div>
    `
  }
}

module.exports = PurchasedStats