const { events } = require('k')
const styles = require('./styles/progressBar')
const html = require('nanohtml')

module.exports = ({
  downloadPercent,
  last = false,
  status,
  shouldBroadcast,
  packageOpened
}) => {
  let color
  switch (status) {
    case events.DOWNLOADED_PUBLISHED:
      color = packageOpened
        ? 'grey'
        : shouldBroadcast ? 'teal' : 'black'
      break
    case events.PAUSED:
    case events.UNCOMMITTED:
      color = 'black'
      break
    case events.AWAITING_DOWNLOAD:
    case events.AWAITING_STATUS:
      color = 'grey'
      break
    case events.DOWNLOADING:
    case events.UPDATE_AVAILABLE:
      color = packageOpened ? 'grey' : 'orange'
      break
    default:
      return (html`
        <div class="${styles.holder(status)} progressBar-holder blinker" style="background-color: rgba(0,0,0,0);">
          <div class="ants"></div>
        </div>
      `)
  }

  return (html`
    <div class="${styles.holder()} progressBar-holder" style="${last ? 'margin-bottom: 40px;' : null}" >
      <div style="background-color: ${styles.colorSelector(color)}; width:${(downloadPercent * 100) + '%'};"></div>
    </div>
  `)
}