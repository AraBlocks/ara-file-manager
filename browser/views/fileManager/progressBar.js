'use strict'

const k = require('../../../lib/constants/stateManagement')
const styles = require('./styles/progressBar')
const html = require('nanohtml')

module.exports = ({
  downloadPercent,
  index,
  last = false,
  status,
  shouldBroadcast
}) => {
  let color
  switch (status) {
    case k.DOWNLOADED_PUBLISHED:
      color = shouldBroadcast ? 'teal' : 'black'
      break
    case k.PAUSED:
    case k.UNCOMMITTED:
      color = 'black'
      break
    case k.AWAITING_DOWNLOAD:
      color = 'grey'
      break
    case k.DOWNLOADING:
    case k.UPDATE_AVAILABLE:
      color = 'orange'
      break
    case k.AWAITING_STATUS:
      const { css } = require('css')
      const tempStyles = css`
        :host {
          background-color: var(--ara-grey);
          height: 1px;
          margin-bottom: 20px;
          width: 20%;
          position: relative;
        }
      `
      return html`
        <div class="${tempStyles} ${index % 2 ? 'back-and-forth' : 'forth-and-back'}">
          <div></div>
        </div>
      `
    default:
      return html`
        <div class="${styles.holder} progressBar-holder" style="background-color: rgba(0,0,0,0);">
          <div class="ants"></div>
        </div>
      `
  }

  return html`
    <div style="${last ? 'margin-bottom: 40px;' : null}" "class="${styles.holder} progressBar-holder">
      <div style="background-color: ${styles.colorSelector(color)}; width:${(downloadPercent * 100) + '%'};"></div>
    </div>
  `
}