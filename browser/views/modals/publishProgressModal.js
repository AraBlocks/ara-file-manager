const { closeModal, openModal, emit } = require('../../lib/tools/windowManagement')
const spinnerBar = require('../../components/spinnerBar')
const Button = require('../../components/button')
const Link = require('../../components/link')
const { shell } = require('electron')
const styles = require('./styles')
const html = require('nanohtml')

module.exports = ({ load, modalName, deployHash, writeHash, priceHash, step }) => {
  const deployLink = new Link({
    children: `Etherscan`,
    onclick: () => {
      deployHash ?
        shell.openExternal(`https://ropsten.etherscan.io/tx/${deployHash}`) :
        null
    }
  })
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
    onclick: () => closeModal('publishProgressModal')
  })
  return html`
    <div class="${styles.container({ justifyContent: 'space-around', height: 95, width: 100, useSelector: false })} modals-container">
      <div class="${styles.title} modal-messageBold">
        Publishing...
      </div>
      <div class="${styles.separator} section-separator" style="width: 90%;"></div>
      <div class="${styles.progressContainer}">
        <div class="${styles.creating}">
          <div class="${styles.progressHolder} modal-progressHolder">
            ${step && step.includes('deploy') ? spinnerBar() : html`<div class="${styles.circle({ color: 'green' })}"></div>`}
          </div>
          <div class="${styles.boldLabel}">
            Creating
          </div>
          <div>
            ${deployLink.render()}
          </div>
          ${'retrydeploy' === step ?
            html`<div class="${styles.gasRefill}" onclick=${() => {
              closeModal('publishProgressModal')
              emit({ event: events.PUBLISH_NEW_GAS, load: { step: 'deploy' } })
            }}>
              <img src="../assets/images/gas.png"/>
            </div>` :
            null
          }
        </div>
        <div class="${styles.writing}">
          <div class="${styles.progressHolder} modal-progressHolder">
            ${step && step.includes('write') ? spinnerBar() : html`<div class="${styles.circle({ color: step && step.includes('price') ? 'green' : 'grey' })}"></div>`}
          </div>
          <div class="${styles.boldLabel}">
            Writing
          </div>
          <div>
            ${writeHash ? writeLink.render() : null}
          </div>
          ${'retrywrite' === step ?
            html`<div class="${styles.gasRefill}" onclick=${() => {
              closeModal('publishProgressModal')
              emit({ event: events.PUBLISH_NEW_GAS, load: { step: 'write' } })
            }}>
              <img src="../assets/images/gas.png"/>
            </div>` :
            null
          }
        </div>
        <div class="${styles.finalizing}">
          <div class="${styles.progressHolder} modal-progressHolder">
            ${step && step.includes('price') ? spinnerBar() : html`<div class="${styles.circle({ color: 'grey' })}"></div>`}
          </div>
          <div class="${styles.boldLabel}">
            Finalizing
          </div>
          <div>
            ${priceHash ? priceLink.render() : null}
          </div>
          ${'retryprice' === step ?
            html`<div class="${styles.gasRefill}" onclick=${() => {
              closeModal('publishProgressModal')
              emit({ event: events.PUBLISH_NEW_GAS, load: { step: 'price' } })
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
