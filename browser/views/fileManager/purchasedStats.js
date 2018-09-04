'use strict'

const { AWAITING_DOWNLOAD, DOWNLOADING } = require('../../../lib/constants/stateManagement')
const Button = require('../../components/button')
const styles = require('./styles/purchasedStats')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class PurchasedStats extends Nanocomponent {
  constructor() {
    super()

    this.children = {
      button: new Button({
        children: 'Update File',
        cssClass: {
          name: 'smallInvisible',
          opts: {
            color: 'blue',
            weight: 'light'
          }
        }
      })
    }

    this.renderButton = this.renderButton.bind(this)
  }

  renderPeers(status, peers) {
    let nodes
    switch (status) {
      case AWAITING_DOWNLOAD:
        break
      default:
        nodes = [
          html`
            <div class="${styles.peers} purchasedStats-peers">
              <b>Peers:</b> ${peers}
            </div>
          `,
          html`
            <div class="${styles.divider} purchasedStats-divider">
              |
            </div>
          `
        ]
    }
    return nodes
  }

  renderButton(status) {
    const { children } = this
    let button
    switch (status) {
      case AWAITING_DOWNLOAD:
      case DOWNLOADING:
        break
      default:
        button = html`
          <div class="${styles.buttonHolder}">
            ${children.button.render()}
          </div>
        `
    }
    return button
  }

  update() {
    return true
  }

  createElement({ earnings, peers, status }) {
    const {
      renderButton,
      renderPeers
    } = this

    return html`
      <div class="${styles.container} styles.container">
        <div class="${styles.stats} purchasedStats-stats">
          ${renderPeers(status, peers)}
          <div class="${styles.earnings(status)} purchasedStats-earnings">
            <b>Earnings:</b> ${earnings} Ara
          </div>
        </div>
        ${renderButton(status)}
      </div>
    `
  }
}

module.exports = PurchasedStats