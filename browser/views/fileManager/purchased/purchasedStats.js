'use strict'

const Button = require('../../../components/button')
const styles = require('./styles/purchasedStats')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class PurchasedStats extends Nanocomponent {
  constructor({
    earnings,
    peers,
    status
   }) {
    super()

    this.state = {
      earnings,
      peers,
      status
    }

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

  update({ status }) {
    const { state } = this
    const sameStatus = state.status === status
    if (!sameStatus) { state.status = status }
    return !sameStatus
  }

  createElement() {
    const { children, state } = this

    return html`
      <div class="${styles.container}">
        <div class="${styles.stats} purchasedStats-stats">
          ${renderPeers()}
          <div class="${styles.earnings(state.status)} purchasedStats-earnings">
            <b>Earnings:</b> ${state.earnings} ARA
          </div>
        </div>
        ${renderButton()}
      </div>
    `

    function renderPeers() {
      let nodes
      switch(state.status) {
        case 0:
          break
        default:
          nodes = [
            html`
              <div class="${styles.peers} purchasedStats-peers">
                <b>Peers:</b> ${state.peers}
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
      switch(state.status) {
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