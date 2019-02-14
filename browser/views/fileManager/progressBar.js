const { events: k } = require('k')
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
    case k.DOWNLOADED_PUBLISHED:
      color = packageOpened
        ? 'grey'
        : shouldBroadcast ? 'teal' : 'black'
      break
    case k.PAUSED:
    case k.UNCOMMITTED:
      color = 'black'
      break
    case k.AWAITING_DOWNLOAD:
    case k.AWAITING_STATUS:
      color = 'grey'
      break
    case k.DOWNLOADING:
    case k.UPDATE_AVAILABLE:
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
