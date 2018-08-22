'use strict'

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
        cssClass : {
          name: 'smallInvisible',
          opts: {
            color: 'blue',
            weight: 'light'
          }
        }
      })
    }
  }

  update() {
    return true
  }

  createElement({ earnings, peers, status }) {
    const { children } = this

    return html`
      <div class="${styles.container} styles.container">
        <div class="${styles.stats} purchasedStats-stats">
          ${renderPeers()}
          <div class="${styles.earnings(status)} purchasedStats-earnings">
            <b>Earnings:</b> ${earnings} Ara
          </div>
        </div>
        ${renderButton()}
      </div>
    `

    function renderPeers() {
      let nodes
      switch(status) {
        case 0:
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

    function renderButton() {
      let button
      switch(status) {
        case 0:
        case 1:
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
  }
}

module.exports = PurchasedStats