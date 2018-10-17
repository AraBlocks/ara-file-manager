'use strict'

const { AWAITING_DOWNLOAD, DOWNLOADING, FEED_MANAGE_FILE } = require('../../../lib/constants/stateManagement')
const DynamicButton = require('../../components/dynamicButton')
const styles = require('./styles/publishedStats')
const windowManagement = require('../../lib/tools/windowManagement')
const { remote } = require('electron')
const windowManager = remote.require('electron-window-manager')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class PublishedStats extends Nanocomponent {
  constructor({ file }){
    super()
    this.props = { file }
  }

  update() {
    return true
  }

  createElement({
    earnings,
    peers,
    price,
    status
  }) {

    return html`
      <div class="${styles.container(status)} publishedStats-container">
        <div class="${styles.price} publishedStats-price">
          ${price} Ara
        </div>
        <div class="${styles.stats} publishedStats-stats">
          <div>
            <span class="${styles.bolden} publishedStats-bolden">Peers:</span > ${peers}
          </div>
          <div class="${styles.divider} publishedStats-divider">
            |
          </div>
          <div>
          <span class="${styles.bolden} publishedStats-bolden">Earnings:</span> ${earnings} Ara
          </div>
        </div>
      </div>
    `
  }
}

module.exports = PublishedStats