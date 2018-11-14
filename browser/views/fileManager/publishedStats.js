'use strict'

const styles = require('./styles/publishedStats')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class PublishedStats extends Nanocomponent {
  update() {
    return true
  }

  createElement({
    earnings,
    peers,
    price,
    status,
    unclaimed
  }) {
    return html`
      <div class="${styles.container(status)} publishedStats-container">
        <div class="${styles.price} publishedStats-price">
          <img class="${styles.iconHolder} header-iconHolder" src="../assets/images/ara_token.png"/>
          ${price}
        </div>
        <div class="${styles.stats} publishedStats-stats">
          <div>
            <span class="${styles.bolden} publishedStats-bolden">Peers:</span> ${peers}
          </div>
          <div class="${styles.divider} publishedStats-divider">
            |
          </div>
          <div>
          <span class="${styles.bolden} publishedStats-bolden">
            Earnings:</span> ${earnings} ${unclaimed ? html`<span style="color:green;">(+${unclaimed})</span>` : null}
          </div>
        </div>
      </div>
    `
  }
}

module.exports = PublishedStats