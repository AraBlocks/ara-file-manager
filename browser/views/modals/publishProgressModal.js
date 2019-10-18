const { closeModal } = require('../../lib/tools/windowManagement')
const { waitModalText } = require('../../lib/tools/generalModalTextProvider')
const spinnerBar = require('../../components/spinnerBar')
const Button = require('../../components/button')
const Link = require('../../components/link')
const { shell } = require('electron')
const styles = require('./styles')
const html = require('nanohtml')

module.exports = ({ load, modalName, deployHash, writeHash, priceHash, receipt, step }) => {
  const { description, waitTime } = waitModalText(modalName, load)
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
    <div class="${styles.container({ justifyContent: 'space-around', height: 95, width: 100 })} modals-container">
      <div class="${styles.messageBold} modal-messageBold">
        Publishing...
      </div>
      <div class="${styles.publishingContainer}">
        <div class="${styles.creating}">
          <div class="${styles.progressHolder} modal-progressHolder">
            ${'deploy' === step ? spinnerBar() : html`<div class="${styles.circle({ color: 'green' })}"></div>`}
          </div>
          <div class="${styles.boldLabel}">
            Creating
          </div>
          <div>
            ${deployLink.render()}
          </div>
        </div>
        <div class="${styles.writing}">
          <div class="${styles.progressHolder} modal-progressHolder">
            ${'write' === step ? spinnerBar() : html`<div class="${styles.circle({ color: step && step.includes('price') ? 'green' : 'grey' })}"></div>`}
          </div>
          <div class="${styles.boldLabel}">
            Writing
          </div>
          <div>
            ${writeHash ? writeLink.render() : null}
          </div>
        </div>
        <div class="${styles.finalizing}">
          <div class="${styles.progressHolder} modal-progressHolder">
            ${'price' === step ? spinnerBar() : html`<div class="${styles.circle({ color: 'priceMined' === step ? 'green' : 'grey' })}"></div>`}
          </div>
          <div class="${styles.boldLabel}">
            Finalizing
          </div>
          <div>
            ${priceHash ? priceLink.render() : null}
          </div>
        </div>
      </div>
      <div>
        ${exit.render()}
      </div>
    </div>
  `
}
