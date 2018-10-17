'use strict'

const k = require('../../lib/constants/stateManagement')
const styles = require('./styles/progressBar')
const html = require('choo/html')
const Nanocomponent = require('nanocomponent')

class ProgressBar extends Nanocomponent {
  update() {
    return true
  }

  createElement({ downloadPercent, status, shouldBroadcast }) {
    let color
    switch (status) {
      case k.DOWNLOADED_PUBLISHED:
        color = shouldBroadcast ? 'blue' : 'black'
        break
      case k.PAUSED:
        color = 'black'
        break
      default:
        color = 'red'
    }

    return html`
      <div class="${styles.holder} progressBar-holder">
        <div style="background-color: ${styles.colorSelector(color)}; width:${(downloadPercent * 100) + '%'};"></div>
      </div>
    `
  }
}

module.exports = ProgressBar