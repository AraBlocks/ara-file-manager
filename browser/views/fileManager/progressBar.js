'use strict'

const k = require('../../../lib/constants/stateManagement')
const styles = require('./styles/progressBar')
const html = require('choo/html')

module.exports = ({
  downloadPercent,
  status,
  shouldBroadcast
}) => {
  let color
  switch (status) {
    case k.DOWNLOADED_PUBLISHED:
      color = shouldBroadcast ? 'blue' : 'black'
      break
    case k.PAUSED:
      color = 'black'
      break
    case k.AWAITING_DOWNLOAD:
      color = 'grey'
      break
    case k.DOWNLOADING:
      color = 'red'
      break
    default:
      return html`
        <div class="${styles.holder} progressBar-holder" style="background-color: rgba(0,0,0,0);">
          <div class="ants"></div>
        </div>
      `
  }

  return html`
    <div class="${styles.holder} progressBar-holder">
      <div style="background-color: ${styles.colorSelector(color)}; width:${(downloadPercent * 100) + '%'};"></div>
    </div>
  `
}