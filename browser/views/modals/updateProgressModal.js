const { closeModal, openModal, emit } = require('../../lib/tools/windowManagement')
const spinnerBar = require('../../components/spinnerBar')
const Button = require('../../components/button')
const Link = require('../../components/link')
const { shell } = require('electron')
const styles = require('./styles')
const html = require('nanohtml')

module.exports = ({ load, modalName, hash, step }) => {
  const updateLink = new Link({
    children: `Etherscan`,
    onclick: () => shell.openExternal(`https://ropsten.etherscan.io/tx/${hash}`)
  })
  const exit = new Button({
    children: 'Exit',
    cssClass: { opts: { height: 3, fontSize: 14, color: 'teal' } },
    onclick: () => closeModal('updateProgressModal')
  })
  return html`
    <div class="${styles.container({ justifyContent: 'space-around', height: 95, width: 100, useSelector: false })} modals-container">
      <div class="${styles.title} modal-messageBold">
        Updating...
      </div>
      <div class="${styles.separator} section-separator" style="width: 90%;"></div>
      <div class="${styles.progressContainer}">
        <div class="${styles.redeeming}">
          <div class="${styles.progressHolder} modal-progressHolder">
            ${spinnerBar()}
          </div>
          <div class="${styles.boldLabel}">
            Updating
          </div>
          <div>
            ${updateLink.render()}
          </div>
          ${'retryupdate' === step ?
            html`<div class="${styles.gasRefill}" onclick=${() => {
              closeModal('updateProgressModal')
              emit({ event: events.UPDATE_NEW_GAS, load: { step: 'update' } })
            }}>
              <img src="../assets/images/gas.png"/>
            </div>` :
            null
          }
        </div>
      </div>
      <div style="width: 100%;">
        ${exit.render()}
      </div>
    </div>
  `
}
