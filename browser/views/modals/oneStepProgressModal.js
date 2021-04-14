const { closeModal, openModal, emit } = require('../../lib/tools/windowManagement')
const spinnerBar = require('../../components/spinnerBar')
const Button = require('../../components/button')
const Link = require('../../components/link')
const { shell } = require('electron')
const styles = require('./styles')
const html = require('nanohtml')

module.exports = ({ load, modalName, hash, step, network, retryEvent, stepName }) => {
  const link = new Link({
    children: `Etherscan`,
    onclick: () => {
      hash ?
        shell.openExternal(network === 'main' ? `https://etherscan.io/${hash}` : `https://ropsten.etherscan.io/tx/${hash}`) :
        null
    }
  })
  const exit = new Button({
    children: 'Exit',
    cssClass: { opts: { height: 3, fontSize: 14, color: 'teal' } },
    onclick: () => closeModal('oneStepProgressModal')
  })
  return html`
    <div class="${styles.container({ justifyContent: 'space-around', height: 95, width: 100, useSelector: false })} modals-container">
      <div class="${styles.title} modal-messageBold">
        ${modalName}...
      </div>
      <div class="${styles.separator} section-separator" style="width: 90%;"></div>
      <div class="${styles.progressContainer}">
        <div class="${styles.oneStep}">
          <div class="${styles.progressHolder} modal-progressHolder">
            ${spinnerBar()}
          </div>
          <div class="${styles.boldLabel}">
            ${stepName}
          </div>
          <div>
            ${link.render()}
          </div>
          ${step && step.includes('retry') ?
            html`<div class="${styles.gasRefill}" onclick=${() => {
              closeModal('oneStepProgressModal')
              emit({ event: retryEvent, load: { step } })
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
