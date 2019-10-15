const { closeModal } = require('../lib/tools/windowManagement')
const { waitModalText } = require('../lib/tools/generalModalTextProvider')
const spinnerBar = require('../components/spinnerBar')
const Link = require('../components/link')
const { shell } = require('electron')
const styles = require('./styles/publishProgress')
const html = require('nanohtml')

module.exports = ({ load, modalName, hash, receipt, type }) => {
  const { description, waitTime } = waitModalText(modalName, load)
  const link = new Link({
    children: `Etherscan`,
    onclick: () => {
      shell.openExternal(`https://ropsten.etherscan.io/tx/${hash}`)
    }
  })
  return html`
    <div class="${styles.container({ justifyContent: 'space-around', height: 95, width: 100 })} modals-container">
      <div class="${styles.messageBold} modal-messageBold">
        Publishing...${hash}
      </div>
      <div class="${styles.horizontalContainer}">
        <div class="${styles.creating}">
          <div class="${styles.spinnerHolder} modal-spinnerHolder">
            ${'deploy' === type ? spinnerBar() : html`<div class="${styles.circle}"></div>`}
          </div>
          <div class="${styles.boldLabel}">
            Creating
          </div>
          <div>
            ${link.render()}
          </div>
        </div>
        <div class="${styles.writing}">
          <div class="${styles.spinnerHolder} modal-spinnerHolder">
            ${'write' === type ? spinnerBar() : html`<div class="${styles.circle}"></div>`}
          </div>
          <div class="${styles.boldLabel}">
            Creating
          </div>
          <div>
            ${link.render()}
          </div>
        </div>
        <div class="${styles.finalizing}">
          <div class="${styles.spinnerHolder} modal-spinnerHolder">
            ${'price' === type ? spinnerBar() : html`<div class="${styles.circle}"></div>`}
          </div>
          <div class="${styles.boldLabel}">
            Finalizing
          </div>
          <div>
            ${link.render()}
          </div>
        </div>
      </div>
    </div>
  `
}
