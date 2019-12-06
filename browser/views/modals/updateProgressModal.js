const { closeModal, openModal, emit } = require('../../lib/tools/windowManagement')
const spinnerBar = require('../../components/spinnerBar')
const Button = require('../../components/button')
const Link = require('../../components/link')
const { shell } = require('electron')
const styles = require('./styles')
const html = require('nanohtml')

module.exports = ({ load, modalName, writeHash, priceHash, step }) => {
  const writeLink = new Link({
    children: `Etherscan`,
    onclick: () => {
      writeHash ?
        shell.openExternal(`https://ropsten.etherscan.io/tx/${writeHash}`) :
        null
    }
  })
  const priceLink = new Link({
    children: `Etherscan`,
    onclick: () => {
      priceHash ?
        shell.openExternal(`https://ropsten.etherscan.io/tx/${priceHash}`) :
        null
    }
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
        ${step.includes('all') ?
          html`
            <div class="${styles.purchasing}">
              <div class="${styles.progressHolder} modal-progressHolder">
                ${step && step.includes('write') ? spinnerBar() : html`<div class="${styles.circle({ color: 'green' })}"></div>`}
              </div>
              <div class="${styles.boldLabel}">
                Writing
              </div>
              <div>
                ${writeHash ? writeLink.render() : null}
              </div>
              ${'retryupdateallwrite' === step ?
                html`<div class="${styles.gasRefill}" onclick=${() => {
                  closeModal('updateProgressModal')
                  emit({ event: events.UPDATE_NEW_GAS, load: { step: 'updateallwrite' } })
                }}>
                  <img src="../assets/images/gas.png"/>
                </div>` :
                null
              }
            </div>
            <div class="${styles.purchasing}">
              <div class="${styles.progressHolder} modal-progressHolder">
                ${step && step.includes('price') ? spinnerBar() : html`<div class="${styles.circle({ color: 'grey' })}"></div>`}
              </div>
              <div class="${styles.boldLabel}">
                Finalizing
              </div>
              <div>
                ${priceHash ? priceLink.render() : null}
              </div>
              ${'retryupdateallprice' === step ?
                html`<div class="${styles.gasRefill}" onclick=${() => {
                  closeModal('updateProgressModal')
                  emit({ event: events.UPDATE_NEW_GAS, load: { step: 'updateprice' } })
                }}>
                  <img src="../assets/images/gas.png"/>
                </div>` :
                null
              }
            </div>
          ` :
          html`
            <div class="${styles.singleTx}">
              <div class="${styles.progressHolder} modal-progressHolder">
                ${spinnerBar()}
              </div>
              <div class="${styles.boldLabel}">
                Updating
              </div>
              <div>
                ${writeHash ? writeLink.render() : priceLink.render()}
              </div>
              ${step.includes('retry') ?
                html`<div class="${styles.gasRefill}" onclick=${() => {
                  closeModal('updateProgressModal')
                  emit({ event: events.UPDATE_NEW_GAS, load: { step: step.includes('price') ? 'updateprice' : 'updatewrite' } })
                }}>
                  <img src="../assets/images/gas.png"/>
                </div>` :
                null
              }
            </div>
          `
        }
      </div>
      <div style="width: 100%;">
        ${exit.render()}
      </div>
    </div>
  `
}
