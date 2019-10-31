const { closeModal, openModal, emit } = require('../../lib/tools/windowManagement')
const spinnerBar = require('../../components/spinnerBar')
const Button = require('../../components/button')
const Link = require('../../components/link')
const { shell } = require('electron')
const styles = require('./styles')
const html = require('nanohtml')

module.exports = ({ load, modalName, approveHash, purchaseHash, showGas, step }) => {
  const approveLink = new Link({
    children: `Etherscan`,
    onclick: () => {
      hash ?
        shell.openExternal(`https://ropsten.etherscan.io/tx/${approveHash}`) :
        null
    }
  })
  const purchaseLink = new Link({
    children: `Etherscan`,
    onclick: () => {
      hash ?
        shell.openExternal(`https://ropsten.etherscan.io/tx/${purchaseHash}`) :
        null
    }
  })
  const exit = new Button({
    children: 'Exit',
    cssClass: { opts: { height: 3, fontSize: 14, color: 'teal' } },
    onclick: () => closeModal('purchaseProgressModal')
  })
  return html`
    <div class="${styles.container({ justifyContent: 'space-around', height: 95, width: 100, useSelector: false })} modals-container">
      <div class="${styles.title} modal-messageBold">
        Purchasing...
      </div>
      <div class="${styles.separator} section-separator" style="width: 90%;"></div>
      <div class="${styles.progressContainer}">
        <div class="${styles.purchasing}">
          <div class="${styles.progressHolder} modal-progressHolder">
            ${step && step.includes('approve') ? spinnerBar() : html`<div class="${styles.circle({ color: 'green' })}"></div>`}
          </div>
          <div class="${styles.boldLabel}">
            Approving
          </div>
          <div>
            ${approveHash ? approveLink.render() : null}
          </div>
          ${'retryapprove' === step ?
            html`<div class="${styles.gasRefill}" onclick=${() => {
              closeModal('purchaseProgressModal')
              emit({ event: events.PURCHASE_NEW_GAS, load: { step: 'approve' } })
            }}>
              <img src="../assets/images/gas.png"/>
            </div>` :
            null
          }
        </div>
        <div class="${styles.purchasing}">
          <div class="${styles.progressHolder} modal-progressHolder">
            ${step && step.includes('purchase') ? spinnerBar() : html`<div class="${styles.circle({ color: 'grey' })}"></div>`}
          </div>
          <div class="${styles.boldLabel}">
            Purchasing
          </div>
          <div>
            ${purchaseHash ? purchaseLink.render() : null}
          </div>
          ${'retrypurchase' === step ?
            html`<div class="${styles.gasRefill}" onclick=${() => {
              closeModal('purchaseProgressModal')
              emit({ event: events.PURCHASE_NEW_GAS, load: { step: 'purchase' } })
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
