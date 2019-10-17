const styles = require('./styles')
const html = require('nanohtml')

module.exports = ({ average, fast, fastest }) => {
  return html`
    <div class="${styles.container({ justifyContent: 'initial', height: 95, width: 90 })} modals-container">
      <div class="${styles.messageBold} modal-messageBold">
        Set Gas Price
      </div>
      <div style="margin-top: 20px;">
        <div class=${styles.gasPriceHolder({})}>
          <div class=${styles.gasPrice({})}>Fastest</div>
          <div class=${styles.gasPrice({ float: 'right', bold: false })}>${fastest} Gwei</div>
        </div>
        <div class=${styles.gasPriceHolder({ color: 'teal'})}>
          <div class=${styles.gasPrice({})}>Fast</div>
          <div class=${styles.gasPrice({ float: 'right', bold: false })}>${fast} Gwei</div>
        </div>
        <div class=${styles.gasPriceHolder({ color: 'darkteal' })}>
          <div class=${styles.gasPrice({})}>Average</div>
          <div class=${styles.gasPrice({ float: 'right', bold: false })}>${average} Gwei</div>
        </div>
      </div>
    </div>
  `
}
